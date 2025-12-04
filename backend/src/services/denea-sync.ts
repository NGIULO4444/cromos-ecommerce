import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

class DeneaSyncService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor(container) {
    super(container)
    this.manager_ = container.manager
  }

  async syncInventoryFromDenea(data: any[]): Promise<{
    success: boolean
    processed: number
    errors: any[]
  }> {
    const inventoryService = this.container_.inventoryService
    const productVariantService = this.container_.productVariantService
    const logger = this.container_.logger

    const errors = []
    let processed = 0

    try {
      for (const item of data) {
        try {
          // Mappa i dati Denea ai campi Medusa
          const mappedItem = this.mapDeneaToMedusa(item)
          
          // Trova la variante del prodotto
          const variant = await productVariantService.retrieveBySKU(mappedItem.sku)
          
          if (!variant) {
            errors.push({
              sku: mappedItem.sku,
              error: "Product variant not found"
            })
            continue
          }

          // Aggiorna l'inventario
          await inventoryService.adjustInventory(
            variant.inventory_item_id,
            "default_location",
            mappedItem.quantity
          )

          processed++
          logger.info(`Synced inventory for SKU: ${mappedItem.sku}`)

        } catch (error) {
          errors.push({
            sku: item.sku || item.codice || "unknown",
            error: error.message
          })
          logger.error("Failed to sync item from Denea", error)
        }
      }

      return {
        success: errors.length === 0,
        processed,
        errors
      }

    } catch (error) {
      logger.error("Denea sync failed", error)
      throw error
    }
  }

  private mapDeneaToMedusa(deneaItem: any): {
    sku: string
    quantity: number
    price?: number
  } {
    // Mappa i campi Denea ai campi Medusa
    // Personalizza questa funzione in base al formato dati Denea
    return {
      sku: deneaItem.codice || deneaItem.sku || deneaItem.code,
      quantity: parseInt(deneaItem.giacenza || deneaItem.quantity || "0"),
      price: parseFloat(deneaItem.prezzo || deneaItem.price || "0")
    }
  }

  async parseCSV(csvContent: string): Promise<any[]> {
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim())
        const item = {}
        
        headers.forEach((header, index) => {
          item[header] = values[index] || ""
        })
        
        data.push(item)
      }
    }

    return data
  }

  async parseXML(xmlContent: string): Promise<any[]> {
    // Implementazione base per parsing XML
    // In produzione, usa una libreria come xml2js
    const logger = this.container_.logger
    
    try {
      // Parsing XML semplificato - da migliorare con xml2js
      const items = []
      const itemMatches = xmlContent.match(/<item[^>]*>[\s\S]*?<\/item>/g)
      
      if (itemMatches) {
        itemMatches.forEach(itemXml => {
          const sku = this.extractXmlValue(itemXml, 'codice') || this.extractXmlValue(itemXml, 'sku')
          const quantity = this.extractXmlValue(itemXml, 'giacenza') || this.extractXmlValue(itemXml, 'quantity')
          const price = this.extractXmlValue(itemXml, 'prezzo') || this.extractXmlValue(itemXml, 'price')
          
          if (sku) {
            items.push({
              codice: sku,
              giacenza: quantity,
              prezzo: price
            })
          }
        })
      }

      return items
    } catch (error) {
      logger.error("XML parsing failed", error)
      throw new Error("Invalid XML format")
    }
  }

  private extractXmlValue(xml: string, tagName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*>([^<]*)<\/${tagName}>`)
    const match = xml.match(regex)
    return match ? match[1].trim() : null
  }

  async validateDeneaWebhook(payload: any, signature: string): Promise<boolean> {
    // Implementa la validazione del webhook Denea
    // Usa il DENEA_WEBHOOK_SECRET per verificare la firma
    const crypto = require('crypto')
    const secret = process.env.DENEA_WEBHOOK_SECRET
    
    if (!secret) {
      return false
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')

    return signature === expectedSignature
  }
}

export default DeneaSyncService
