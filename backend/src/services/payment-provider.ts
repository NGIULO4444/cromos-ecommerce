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

  constructor(container) {
    super(container)
    this.logger_ = container.logger
  }

  /**
   * Override del metodo che causa il crash
   * Invece di crashare, logga l'errore e continua
   */
  async updatePaymentProviders(providers: any[]): Promise<void> {
    try {
      // Se non ci sono providers, non fare niente
      if (!providers || providers.length === 0) {
        this.logger_.warn("No payment providers to update, skipping...")
        return
      }

      // Prova l'update originale
      await super.updatePaymentProviders(providers)
    } catch (error) {
      // Se fallisce, logga e continua invece di crashare
      this.logger_.error("PaymentProviderService update failed, continuing anyway:", error.message)
      
      // Non rilanciare l'errore - questo permette a Medusa di continuare
      return
    }
  }

  /**
   * Override anche del metodo registerInstalledProviders
   */
  async registerInstalledProviders(providers: any[]): Promise<void> {
    try {
      if (!providers || providers.length === 0) {
        this.logger_.warn("No payment providers to register, skipping...")
        return
      }

      await super.registerInstalledProviders(providers)
    } catch (error) {
      this.logger_.error("PaymentProviderService registration failed, continuing anyway:", error.message)
      return
    }
  }
}

export default PaymentProviderService
