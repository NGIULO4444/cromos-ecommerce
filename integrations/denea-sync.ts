#!/usr/bin/env node

/**
 * Cromos - Denea Easy FTT Integration
 * Script per sincronizzazione magazzino con gestionale Denea
 */

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import xml2js from 'xml2js'
import csv from 'csv-parser'
import cron from 'node-cron'
import dotenv from 'dotenv'

// Carica variabili d'ambiente
dotenv.config()

interface DeneaProduct {
  codice: string
  descrizione: string
  categoria: string
  giacenza: number
  prezzo: number
  prezzo_acquisto?: number
  fornitore?: string
  marca?: string
  modello?: string
  colore?: string
  materiale?: string
  compatibilita?: string
}

interface MedusaVariant {
  id: string
  sku: string
  inventory_quantity: number
  prices: Array<{
    amount: number
    currency_code: string
  }>
}

interface SyncResult {
  success: boolean
  processed: number
  updated: number
  errors: Array<{
    sku: string
    error: string
  }>
  summary: string
}

class DeneaSyncService {
  private readonly deneaApiUrl: string
  private readonly deneaApiKey: string
  private readonly medusaApiUrl: string
  private readonly medusaApiKey: string

  constructor() {
    this.deneaApiUrl = process.env.DENEA_API_URL || ''
    this.deneaApiKey = process.env.DENEA_API_KEY || ''
    this.medusaApiUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
    this.medusaApiKey = process.env.MEDUSA_API_KEY || ''

    if (!this.deneaApiUrl || !this.deneaApiKey) {
      console.warn('⚠️  Denea API credentials not configured')
    }
  }

  /**
   * Importa dati da file CSV Denea
   */
  async importFromCSV(filePath: string): Promise<SyncResult> {
    console.log(`📁 Importing from CSV: ${filePath}`)
    
    try {
      const products = await this.parseCSVFile(filePath)
      console.log(`📊 Found ${products.length} products in CSV`)
      
      return await this.syncProducts(products)
    } catch (error) {
      console.error('❌ CSV import failed:', error)
      throw error
    }
  }

  /**
   * Importa dati da file XML Denea
   */
  async importFromXML(filePath: string): Promise<SyncResult> {
    console.log(`📁 Importing from XML: ${filePath}`)
    
    try {
      const products = await this.parseXMLFile(filePath)
      console.log(`📊 Found ${products.length} products in XML`)
      
      return await this.syncProducts(products)
    } catch (error) {
      console.error('❌ XML import failed:', error)
      throw error
    }
  }

  /**
   * Sincronizza via API Denea
   */
  async syncFromAPI(): Promise<SyncResult> {
    console.log('🔄 Syncing from Denea API...')
    
    try {
      const products = await this.fetchFromDeneaAPI()
      console.log(`📊 Found ${products.length} products from API`)
      
      return await this.syncProducts(products)
    } catch (error) {
      console.error('❌ API sync failed:', error)
      throw error
    }
  }

  /**
   * Parsing file CSV
   */
  private async parseCSVFile(filePath: string): Promise<DeneaProduct[]> {
    return new Promise((resolve, reject) => {
      const products: DeneaProduct[] = []
      
      fs.createReadStream(filePath)
        .pipe(csv({
          separator: ';', // Denea usa spesso punto e virgola
          headers: ['codice', 'descrizione', 'categoria', 'giacenza', 'prezzo', 'prezzo_acquisto', 'fornitore', 'marca', 'modello', 'colore', 'materiale', 'compatibilita']
        }))
        .on('data', (row) => {
          if (row.codice && row.codice.trim()) {
            products.push({
              codice: row.codice.trim(),
              descrizione: row.descrizione || '',
              categoria: row.categoria || '',
              giacenza: parseInt(row.giacenza) || 0,
              prezzo: parseFloat(row.prezzo) || 0,
              prezzo_acquisto: parseFloat(row.prezzo_acquisto) || undefined,
              fornitore: row.fornitore || undefined,
              marca: row.marca || undefined,
              modello: row.modello || undefined,
              colore: row.colore || undefined,
              materiale: row.materiale || undefined,
              compatibilita: row.compatibilita || undefined
            })
          }
        })
        .on('end', () => {
          console.log(`✅ CSV parsed: ${products.length} products`)
          resolve(products)
        })
        .on('error', reject)
    })
  }

  /**
   * Parsing file XML
   */
  private async parseXMLFile(filePath: string): Promise<DeneaProduct[]> {
    try {
      const xmlContent = fs.readFileSync(filePath, 'utf8')
      const parser = new xml2js.Parser({ explicitArray: false })
      const result = await parser.parseStringPromise(xmlContent)
      
      const products: DeneaProduct[] = []
      const items = result.products?.product || result.articoli?.articolo || []
      
      const itemsArray = Array.isArray(items) ? items : [items]
      
      for (const item of itemsArray) {
        if (item.codice || item.sku || item.code) {
          products.push({
            codice: item.codice || item.sku || item.code,
            descrizione: item.descrizione || item.nome || item.name || '',
            categoria: item.categoria || item.category || '',
            giacenza: parseInt(item.giacenza || item.stock || item.quantity) || 0,
            prezzo: parseFloat(item.prezzo || item.price) || 0,
            prezzo_acquisto: parseFloat(item.prezzo_acquisto || item.cost_price) || undefined,
            fornitore: item.fornitore || item.supplier || undefined,
            marca: item.marca || item.brand || undefined,
            modello: item.modello || item.model || undefined,
            colore: item.colore || item.color || undefined,
            materiale: item.materiale || item.material || undefined,
            compatibilita: item.compatibilita || item.compatibility || undefined
          })
        }
      }
      
      console.log(`✅ XML parsed: ${products.length} products`)
      return products
    } catch (error) {
      console.error('❌ XML parsing failed:', error)
      throw error
    }
  }

  /**
   * Fetch da API Denea
   */
  private async fetchFromDeneaAPI(): Promise<DeneaProduct[]> {
    try {
      const response = await axios.get(`${this.deneaApiUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${this.deneaApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })
      
      const products: DeneaProduct[] = []
      const items = response.data.products || response.data.data || response.data
      
      for (const item of items) {
        products.push({
          codice: item.sku || item.codice || item.code,
          descrizione: item.name || item.descrizione || item.title,
          categoria: item.category || item.categoria,
          giacenza: parseInt(item.stock || item.giacenza || item.quantity) || 0,
          prezzo: parseFloat(item.price || item.prezzo) || 0,
          prezzo_acquisto: parseFloat(item.cost_price || item.prezzo_acquisto) || undefined,
          fornitore: item.supplier || item.fornitore || undefined,
          marca: item.brand || item.marca || undefined,
          modello: item.model || item.modello || undefined,
          colore: item.color || item.colore || undefined,
          materiale: item.material || item.materiale || undefined,
          compatibilita: item.compatibility || item.compatibilita || undefined
        })
      }
      
      return products
    } catch (error) {
      console.error('❌ Denea API fetch failed:', error)
      throw error
    }
  }

  /**
   * Sincronizza prodotti con Medusa
   */
  private async syncProducts(deneaProducts: DeneaProduct[]): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      processed: 0,
      updated: 0,
      errors: [],
      summary: ''
    }

    console.log(`🔄 Starting sync of ${deneaProducts.length} products...`)
    
    // Log sync start
    const syncLogId = await this.logSyncStart('denea_import', deneaProducts.length)
    
    try {
      for (const deneaProduct of deneaProducts) {
        result.processed++
        
        try {
          // Trova la mappatura SKU
          const mapping = await this.findSKUMapping(deneaProduct.codice)
          
          if (!mapping) {
            result.errors.push({
              sku: deneaProduct.codice,
              error: 'SKU mapping not found'
            })
            continue
          }

          // Aggiorna inventario in Medusa
          await this.updateMedusaInventory(mapping.medusa_variant_id, deneaProduct.giacenza)
          
          // Aggiorna prezzo se disponibile
          if (deneaProduct.prezzo > 0) {
            await this.updateMedusaPrice(mapping.medusa_variant_id, deneaProduct.prezzo)
          }

          // Aggiorna attributi estesi
          await this.updateProductExtended(mapping.product_id, deneaProduct)
          
          // Aggiorna timestamp sync nella mappatura
          await this.updateMappingSync(mapping.id)
          
          result.updated++
          
          if (result.processed % 50 === 0) {
            console.log(`📊 Progress: ${result.processed}/${deneaProducts.length} processed`)
          }
          
        } catch (error) {
          result.errors.push({
            sku: deneaProduct.codice,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      result.success = result.errors.length === 0
      result.summary = `Processed: ${result.processed}, Updated: ${result.updated}, Errors: ${result.errors.length}`
      
      // Log sync completion
      await this.logSyncComplete(syncLogId, result)
      
      console.log(`✅ Sync completed: ${result.summary}`)
      
      return result
      
    } catch (error) {
      await this.logSyncError(syncLogId, error)
      throw error
    }
  }

  /**
   * Trova mappatura SKU Denea -> Medusa
   */
  private async findSKUMapping(deneaSku: string): Promise<any> {
    try {
      const response = await axios.get(`${this.medusaApiUrl}/admin/denea-mapping`, {
        params: { denea_sku: deneaSku },
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data.mapping
    } catch (error) {
      return null
    }
  }

  /**
   * Aggiorna inventario Medusa
   */
  private async updateMedusaInventory(variantId: string, quantity: number): Promise<void> {
    try {
      await axios.put(`${this.medusaApiUrl}/admin/inventory/update`, {
        variant_id: variantId,
        quantity: quantity,
        adjustment_type: 'set'
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error(`❌ Failed to update inventory for variant ${variantId}:`, error)
      throw error
    }
  }

  /**
   * Aggiorna prezzo Medusa
   */
  private async updateMedusaPrice(variantId: string, price: number): Promise<void> {
    try {
      // Converti prezzo in centesimi (Medusa format)
      const priceInCents = Math.round(price * 100)
      
      await axios.post(`${this.medusaApiUrl}/admin/products/variants/${variantId}/prices`, {
        prices: [{
          currency_code: 'EUR',
          amount: priceInCents
        }]
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error(`❌ Failed to update price for variant ${variantId}:`, error)
      // Non bloccare il sync per errori di prezzo
    }
  }

  /**
   * Aggiorna attributi estesi prodotto
   */
  private async updateProductExtended(productId: string, deneaProduct: DeneaProduct): Promise<void> {
    try {
      await axios.put(`${this.medusaApiUrl}/admin/products/${productId}/extended`, {
        denea_sku: deneaProduct.codice,
        denea_category: deneaProduct.categoria,
        supplier_code: deneaProduct.fornitore,
        cost_price: deneaProduct.prezzo_acquisto,
        phone_brand: deneaProduct.marca,
        phone_model: deneaProduct.modello,
        color: deneaProduct.colore,
        material: deneaProduct.materiale,
        compatibility: deneaProduct.compatibilita,
        last_sync_at: new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      // Non bloccare il sync per errori di attributi estesi
      console.warn(`⚠️  Failed to update extended attributes for product ${productId}`)
    }
  }

  /**
   * Aggiorna timestamp sync mappatura
   */
  private async updateMappingSync(mappingId: string): Promise<void> {
    try {
      await axios.put(`${this.medusaApiUrl}/admin/denea-mapping/${mappingId}`, {
        last_sync_at: new Date().toISOString(),
        mapping_status: 'active'
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      // Non bloccare il sync
    }
  }

  /**
   * Log inizio sincronizzazione
   */
  private async logSyncStart(syncType: string, itemCount: number): Promise<string> {
    try {
      const response = await axios.post(`${this.medusaApiUrl}/admin/sync-log`, {
        sync_type: syncType,
        status: 'running',
        items_processed: 0,
        items_success: 0,
        items_error: 0,
        sync_data: { total_items: itemCount }
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data.log.id
    } catch (error) {
      console.warn('⚠️  Failed to log sync start')
      return 'unknown'
    }
  }

  /**
   * Log completamento sincronizzazione
   */
  private async logSyncComplete(syncLogId: string, result: SyncResult): Promise<void> {
    try {
      await axios.put(`${this.medusaApiUrl}/admin/sync-log/${syncLogId}`, {
        status: result.success ? 'success' : 'partial',
        items_processed: result.processed,
        items_success: result.updated,
        items_error: result.errors.length,
        error_details: result.errors,
        completed_at: new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.warn('⚠️  Failed to log sync completion')
    }
  }

  /**
   * Log errore sincronizzazione
   */
  private async logSyncError(syncLogId: string, error: any): Promise<void> {
    try {
      await axios.put(`${this.medusaApiUrl}/admin/sync-log/${syncLogId}`, {
        status: 'error',
        error_details: { error: error.message || 'Unknown error' },
        completed_at: new Date().toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${this.medusaApiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (logError) {
      console.warn('⚠️  Failed to log sync error')
    }
  }

  /**
   * Webhook handler per aggiornamenti real-time da Denea
   */
  async handleWebhook(payload: any, signature: string): Promise<boolean> {
    try {
      // Verifica firma webhook
      if (!this.verifyWebhookSignature(payload, signature)) {
        console.error('❌ Invalid webhook signature')
        return false
      }

      console.log('📨 Processing Denea webhook...')
      
      const updates = payload.updates || [payload]
      
      for (const update of updates) {
        try {
          const deneaProduct: DeneaProduct = {
            codice: update.sku || update.codice,
            descrizione: update.name || update.descrizione || '',
            categoria: update.category || update.categoria || '',
            giacenza: parseInt(update.stock || update.giacenza) || 0,
            prezzo: parseFloat(update.price || update.prezzo) || 0
          }
          
          await this.syncProducts([deneaProduct])
          
        } catch (error) {
          console.error(`❌ Failed to process webhook update for SKU ${update.sku}:`, error)
        }
      }
      
      console.log('✅ Webhook processed successfully')
      return true
      
    } catch (error) {
      console.error('❌ Webhook processing failed:', error)
      return false
    }
  }

  /**
   * Verifica firma webhook
   */
  private verifyWebhookSignature(payload: any, signature: string): boolean {
    const crypto = require('crypto')
    const secret = process.env.DENEA_WEBHOOK_SECRET
    
    if (!secret) {
      console.warn('⚠️  DENEA_WEBHOOK_SECRET not configured')
      return false
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')

    return signature === expectedSignature
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  
  const syncService = new DeneaSyncService()
  
  try {
    switch (command) {
      case 'csv':
        if (!args[1]) {
          console.error('❌ CSV file path required')
          process.exit(1)
        }
        await syncService.importFromCSV(args[1])
        break
        
      case 'xml':
        if (!args[1]) {
          console.error('❌ XML file path required')
          process.exit(1)
        }
        await syncService.importFromXML(args[1])
        break
        
      case 'api':
        await syncService.syncFromAPI()
        break
        
      case 'schedule':
        console.log('🕐 Starting scheduled sync (every 5 minutes)...')
        cron.schedule('*/5 * * * *', async () => {
          console.log('⏰ Running scheduled sync...')
          try {
            await syncService.syncFromAPI()
          } catch (error) {
            console.error('❌ Scheduled sync failed:', error)
          }
        })
        break
        
      default:
        console.log(`
🔄 Cromos Denea Sync Tool

Usage:
  node denea-sync.ts csv <file.csv>     Import from CSV file
  node denea-sync.ts xml <file.xml>     Import from XML file  
  node denea-sync.ts api                Sync from Denea API
  node denea-sync.ts schedule           Start scheduled sync (every 5 min)

Environment Variables:
  DENEA_API_URL          Denea API endpoint
  DENEA_API_KEY          Denea API key
  DENEA_WEBHOOK_SECRET   Webhook signature secret
  MEDUSA_BACKEND_URL     Medusa backend URL
  MEDUSA_API_KEY         Medusa admin API key
        `)
        break
    }
  } catch (error) {
    console.error('❌ Sync failed:', error)
    process.exit(1)
  }
}

// Esegui se chiamato direttamente
if (require.main === module) {
  main()
}

export { DeneaSyncService }
export default DeneaSyncService
