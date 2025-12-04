import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { EntityManager } from "typeorm"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const manager: EntityManager = req.scope.resolve("manager")
  const inventoryService = req.scope.resolve("inventoryService")
  const productVariantService = req.scope.resolve("productVariantService")
  const logger = req.scope.resolve("logger")

  try {
    const { items } = req.body as {
      items: Array<{
        sku: string
        quantity: number
        location_id?: string
      }>
    }

    if (!items || !Array.isArray(items)) {
      res.status(400).json({
        message: "Invalid request body. Expected 'items' array."
      })
      return
    }

    const results = []

    for (const item of items) {
      try {
        // Trova la variante del prodotto tramite SKU
        const variant = await productVariantService.retrieveBySKU(item.sku)
        
        if (!variant) {
          results.push({
            sku: item.sku,
            success: false,
            error: "Product variant not found"
          })
          continue
        }

        // Aggiorna l'inventario
        await inventoryService.adjustInventory(
          variant.inventory_item_id,
          item.location_id || "default_location",
          item.quantity
        )

        results.push({
          sku: item.sku,
          success: true,
          updated_quantity: item.quantity
        })

        logger.info(`Inventory synced for SKU: ${item.sku}, Quantity: ${item.quantity}`)

      } catch (error) {
        results.push({
          sku: item.sku,
          success: false,
          error: error.message
        })
        logger.error(`Failed to sync inventory for SKU: ${item.sku}`, error)
      }
    }

    res.status(200).json({
      message: "Inventory sync completed",
      results,
      total_processed: items.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    })

  } catch (error) {
    logger.error("Inventory sync failed", error)
    res.status(500).json({
      message: "Internal server error during inventory sync",
      error: error.message
    })
  }
}
