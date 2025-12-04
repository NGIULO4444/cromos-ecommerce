import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  OrderService,
} from "@medusajs/medusa"

export default async function inventorySyncHandler({ 
  data, 
  eventName, 
  container, 
  pluginOptions,
}: SubscriberArgs<Record<string, any>>) {
  const logger = container.resolve("logger")
  const deneaSyncService = container.resolve("deneaSyncService")

  try {
    switch (eventName) {
      case "order.placed":
        await handleOrderPlaced(data, container)
        break
      case "order.canceled":
        await handleOrderCanceled(data, container)
        break
      case "inventory.updated":
        await handleInventoryUpdated(data, container)
        break
      default:
        logger.info(`Unhandled inventory sync event: ${eventName}`)
    }
  } catch (error) {
    logger.error(`Inventory sync handler failed for event ${eventName}:`, error)
  }
}

async function handleOrderPlaced(data: any, container: any) {
  const logger = container.resolve("logger")
  const orderService: OrderService = container.resolve("orderService")

  try {
    const order = await orderService.retrieve(data.id, {
      relations: ["items", "items.variant"]
    })

    logger.info(`Processing inventory sync for order: ${order.id}`)

    // Qui puoi implementare la logica per sincronizzare
    // le quantità con Denea dopo un ordine
    for (const item of order.items) {
      logger.info(`Item sold: ${item.variant.sku}, Quantity: ${item.quantity}`)
      // Invia aggiornamento a Denea se necessario
    }

  } catch (error) {
    logger.error("Failed to handle order placed event:", error)
  }
}

async function handleOrderCanceled(data: any, container: any) {
  const logger = container.resolve("logger")
  const orderService: OrderService = container.resolve("orderService")

  try {
    const order = await orderService.retrieve(data.id, {
      relations: ["items", "items.variant"]
    })

    logger.info(`Processing inventory restoration for canceled order: ${order.id}`)

    // Ripristina le quantità in inventario
    for (const item of order.items) {
      logger.info(`Restoring inventory: ${item.variant.sku}, Quantity: ${item.quantity}`)
      // Logica per ripristinare l'inventario
    }

  } catch (error) {
    logger.error("Failed to handle order canceled event:", error)
  }
}

async function handleInventoryUpdated(data: any, container: any) {
  const logger = container.resolve("logger")
  
  try {
    logger.info(`Inventory updated for item: ${data.inventory_item_id}`)
    // Qui puoi implementare webhook verso Denea per notificare cambiamenti
    
  } catch (error) {
    logger.error("Failed to handle inventory updated event:", error)
  }
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.canceled", 
    "inventory.updated"
  ],
  context: {
    subscriberId: "inventory-sync-handler",
  },
}
