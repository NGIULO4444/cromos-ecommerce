import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const inventoryService = req.scope.resolve("inventoryService")
  const productVariantService = req.scope.resolve("productVariantService")
  const logger = req.scope.resolve("logger")

  try {
    const { sku, variant_id, location_id } = req.query as {
      sku?: string
      variant_id?: string
      location_id?: string
    }

    if (!sku && !variant_id) {
      res.status(400).json({
        message: "Either 'sku' or 'variant_id' parameter is required"
      })
      return
    }

    let variant
    if (sku) {
      variant = await productVariantService.retrieveBySKU(sku as string)
    } else {
      variant = await productVariantService.retrieve(variant_id as string)
    }

    if (!variant) {
      res.status(404).json({
        message: "Product variant not found",
        available: false,
        quantity: 0
      })
      return
    }

    const locationId = (location_id as string) || "default_location"

    // Ottieni le informazioni sull'inventario
    const inventoryItem = await inventoryService.retrieveInventoryItem(
      variant.inventory_item_id,
      locationId
    )

    const quantity = inventoryItem?.stocked_quantity || 0
    const reservedQuantity = inventoryItem?.reserved_quantity || 0
    const availableQuantity = Math.max(0, quantity - reservedQuantity)

    res.status(200).json({
      sku: variant.sku,
      variant_id: variant.id,
      product_id: variant.product_id,
      available: availableQuantity > 0,
      quantity: availableQuantity,
      total_quantity: quantity,
      reserved_quantity: reservedQuantity,
      location_id: locationId,
      last_updated: inventoryItem?.updated_at || null
    })

  } catch (error) {
    logger.error("Inventory check failed", error)
    res.status(500).json({
      message: "Internal server error during inventory check",
      error: error.message,
      available: false,
      quantity: 0
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const inventoryService = req.scope.resolve("inventoryService")
  const productVariantService = req.scope.resolve("productVariantService")
  const logger = req.scope.resolve("logger")

  try {
    const { items, location_id } = req.body as {
      items: Array<{
        sku?: string
        variant_id?: string
        quantity: number
      }>
      location_id?: string
    }

    if (!items || !Array.isArray(items)) {
      res.status(400).json({
        message: "Invalid request body. Expected 'items' array."
      })
      return
    }

    const locationId = location_id || "default_location"
    const results = []

    for (const item of items) {
      try {
        let variant
        if (item.sku) {
          variant = await productVariantService.retrieveBySKU(item.sku)
        } else if (item.variant_id) {
          variant = await productVariantService.retrieve(item.variant_id)
        }

        if (!variant) {
          results.push({
            sku: item.sku,
            variant_id: item.variant_id,
            requested_quantity: item.quantity,
            available: false,
            available_quantity: 0,
            error: "Product variant not found"
          })
          continue
        }

        const inventoryItem = await inventoryService.retrieveInventoryItem(
          variant.inventory_item_id,
          locationId
        )

        const quantity = inventoryItem?.stocked_quantity || 0
        const reservedQuantity = inventoryItem?.reserved_quantity || 0
        const availableQuantity = Math.max(0, quantity - reservedQuantity)

        results.push({
          sku: variant.sku,
          variant_id: variant.id,
          product_id: variant.product_id,
          requested_quantity: item.quantity,
          available: availableQuantity >= item.quantity,
          available_quantity: availableQuantity,
          total_quantity: quantity,
          reserved_quantity: reservedQuantity
        })

      } catch (error) {
        results.push({
          sku: item.sku,
          variant_id: item.variant_id,
          requested_quantity: item.quantity,
          available: false,
          available_quantity: 0,
          error: error.message
        })
      }
    }

    const allAvailable = results.every(r => r.available)

    res.status(200).json({
      message: "Inventory check completed",
      all_available: allAvailable,
      results,
      location_id: locationId
    })

  } catch (error) {
    logger.error("Bulk inventory check failed", error)
    res.status(500).json({
      message: "Internal server error during bulk inventory check",
      error: error.message
    })
  }
}
