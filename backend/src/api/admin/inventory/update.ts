import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import { EntityManager } from "typeorm"

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const manager: EntityManager = req.scope.resolve("manager")
  const inventoryService = req.scope.resolve("inventoryService")
  const productVariantService = req.scope.resolve("productVariantService")
  const logger = req.scope.resolve("logger")

  try {
    const { sku, quantity, location_id, adjustment_type = "set" } = req.body as {
      sku: string
      quantity: number
      location_id?: string
      adjustment_type?: "set" | "increment" | "decrement"
    }

    if (!sku || quantity === undefined) {
      res.status(400).json({
        message: "SKU and quantity are required"
      })
      return
    }

    // Trova la variante del prodotto tramite SKU
    const variant = await productVariantService.retrieveBySKU(sku)
    
    if (!variant) {
      res.status(404).json({
        message: `Product variant with SKU '${sku}' not found`
      })
      return
    }

    const locationId = location_id || "default_location"

    // Ottieni la quantità attuale se necessario
    let finalQuantity = quantity
    if (adjustment_type !== "set") {
      const currentInventory = await inventoryService.retrieveInventoryItem(
        variant.inventory_item_id,
        locationId
      )
      const currentQuantity = currentInventory?.stocked_quantity || 0

      if (adjustment_type === "increment") {
        finalQuantity = currentQuantity + quantity
      } else if (adjustment_type === "decrement") {
        finalQuantity = Math.max(0, currentQuantity - quantity)
      }
    }

    // Aggiorna l'inventario
    await inventoryService.adjustInventory(
      variant.inventory_item_id,
      locationId,
      finalQuantity
    )

    logger.info(`Inventory updated for SKU: ${sku}, New quantity: ${finalQuantity}`)

    res.status(200).json({
      message: "Inventory updated successfully",
      sku,
      previous_quantity: adjustment_type !== "set" ? quantity : null,
      new_quantity: finalQuantity,
      adjustment_type,
      location_id: locationId
    })

  } catch (error) {
    logger.error("Inventory update failed", error)
    res.status(500).json({
      message: "Internal server error during inventory update",
      error: error.message
    })
  }
}
