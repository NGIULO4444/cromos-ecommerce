import { PaymentProviderService as MedusaPaymentProviderService } from "@medusajs/medusa"
import { Logger } from "@medusajs/medusa"

/**
 * OVERRIDE COMPLETO del PaymentProviderService per risolvere il bug TypeORM
 * "Empty criteria(s) are not allowed for the update method"
 * 
 * Questo è un bug noto di Medusa v1 quando non ci sono payment providers nel database
 */
class PaymentProviderService extends MedusaPaymentProviderService {
  protected readonly logger_: Logger

  constructor(container: any) {
    super(container)
    this.logger_ = container.logger
  }

  /**
   * Override del metodo registerInstalledProviders che causa il crash
   * Invece di crashare, logga l'errore e continua
   */
  async registerInstalledProviders(providers: any[]): Promise<void> {
    try {
      // Se non ci sono providers, non fare niente
      if (!providers || providers.length === 0) {
        this.logger_.warn("No payment providers to register, skipping...")
        return
      }

      // Prova la registrazione originale
      await super.registerInstalledProviders(providers)
    } catch (error: any) {
      // Se fallisce, logga e continua invece di crashare
      this.logger_.error("PaymentProviderService registration failed, continuing anyway:", error?.message || error)
      
      // Non rilanciare l'errore - questo permette a Medusa di continuare
      return
    }
  }

  /**
   * Override del metodo updateProvider per evitare il TypeORM error
   */
  async updateProvider(providerId: string, data: any): Promise<any> {
    try {
      if (!providerId || !data) {
        this.logger_.warn("Invalid provider data, skipping update...")
        return null
      }

      return await super.updateProvider(providerId, data)
    } catch (error: any) {
      this.logger_.error("PaymentProviderService updateProvider failed, continuing anyway:", error?.message || error)
      return null
    }
  }
}

export default PaymentProviderService
