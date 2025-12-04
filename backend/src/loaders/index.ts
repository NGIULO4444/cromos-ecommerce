import { MedusaContainer } from "@medusajs/medusa"
import { asClass } from "awilix"
import DeneaSyncService from "../services/denea-sync"

export default async (container: MedusaContainer): Promise<void> => {
  // Registra i servizi custom
  container.register({
    deneaSyncService: asClass(DeneaSyncService).singleton()
  })

  // Configura middleware di logging
  const logger = container.resolve("logger")
  logger.info("Custom services and middleware loaded successfully")
}
