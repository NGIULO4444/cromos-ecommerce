import { PaymentProviderService as MedusaPaymentProviderService } from "@medusajs/medusa"

class PaymentProviderService extends MedusaPaymentProviderService {
  async registerInstalledProviders(providerIds: string[]): Promise<void> {
    try {
      // Override del metodo rotto - non fa niente invece di crashare
      console.log("PaymentProviderService override: skipping provider registration to avoid crash")
      return Promise.resolve()
    } catch (error) {
      console.log("PaymentProviderService override: caught error", error)
      return Promise.resolve()
    }
  }

  async updateProvider(providerId: string, data: any): Promise<any> {
    try {
      // Override sicuro che controlla se il provider exists
      const existingProvider = await this.retrieveProvider(providerId).catch(() => null)
      if (!existingProvider) {
        console.log(`PaymentProviderService override: provider ${providerId} not found, skipping update`)
        return Promise.resolve()
      }
      return super.updateProvider(providerId, data)
    } catch (error) {
      console.log("PaymentProviderService override: caught update error", error)
      return Promise.resolve()
    }
  }
}

export default PaymentProviderService
