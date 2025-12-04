#!/usr/bin/env node

/**
 * Cromos Denea Webhook Server
 * Server per ricevere webhook da Denea Easy FTT
 */

import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import { DeneaSyncService } from './denea-sync'

dotenv.config()

const app = express()
const port = process.env.WEBHOOK_PORT || 3001
const syncService = new DeneaSyncService()

// Middleware
app.use(helmet())
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'cromos-denea-webhook'
  })
})

// Denea webhook endpoint
app.post('/webhook/denea', async (req, res) => {
  try {
    const signature = req.headers['x-denea-signature'] as string || ''
    const payload = req.body

    console.log('📨 Received Denea webhook:', {
      signature: signature ? 'present' : 'missing',
      payloadSize: JSON.stringify(payload).length
    })

    // Processa il webhook
    const success = await syncService.handleWebhook(payload, signature)

    if (success) {
      res.status(200).json({
        message: 'Webhook processed successfully',
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(400).json({
        error: 'Webhook processing failed',
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('❌ Webhook error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Generic webhook endpoint per testing
app.post('/webhook/test', (req, res) => {
  console.log('🧪 Test webhook received:', {
    headers: req.headers,
    body: req.body
  })

  res.json({
    message: 'Test webhook received',
    received: req.body,
    timestamp: new Date().toISOString()
  })
})

// Endpoint per trigger manuale sync
app.post('/sync/manual', async (req, res) => {
  try {
    console.log('🔄 Manual sync triggered')
    
    const result = await syncService.syncFromAPI()
    
    res.json({
      message: 'Manual sync completed',
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Manual sync error:', error)
    res.status(500).json({
      error: 'Manual sync failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Endpoint per upload file CSV/XML
app.post('/upload/:type', async (req, res) => {
  try {
    const { type } = req.params // 'csv' or 'xml'
    const { fileContent, fileName } = req.body

    if (!fileContent) {
      return res.status(400).json({
        error: 'File content is required'
      })
    }

    console.log(`📁 Processing uploaded ${type.toUpperCase()} file: ${fileName}`)

    // Salva temporaneamente il file
    const fs = require('fs')
    const path = require('path')
    const tempDir = path.join(__dirname, 'temp')
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const tempFilePath = path.join(tempDir, `upload_${Date.now()}.${type}`)
    fs.writeFileSync(tempFilePath, fileContent)

    let result
    if (type === 'csv') {
      result = await syncService.importFromCSV(tempFilePath)
    } else if (type === 'xml') {
      result = await syncService.importFromXML(tempFilePath)
    } else {
      throw new Error('Invalid file type. Only CSV and XML are supported.')
    }

    // Rimuovi file temporaneo
    fs.unlinkSync(tempFilePath)

    res.json({
      message: `${type.toUpperCase()} file processed successfully`,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`❌ File upload error:`, error)
    res.status(500).json({
      error: 'File processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    service: 'Cromos Denea Integration',
    version: '1.0.0',
    status: 'running',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /health',
      webhook: 'POST /webhook/denea',
      test: 'POST /webhook/test',
      manual_sync: 'POST /sync/manual',
      upload_csv: 'POST /upload/csv',
      upload_xml: 'POST /upload/xml'
    }
  })
})

// Error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error:', error)
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(port, () => {
  console.log(`
🚀 Cromos Denea Webhook Server Started

📍 Server: http://localhost:${port}
🔗 Endpoints:
   • Health Check: GET /health
   • Denea Webhook: POST /webhook/denea
   • Manual Sync: POST /sync/manual
   • Upload CSV: POST /upload/csv
   • Upload XML: POST /upload/xml
   • Status: GET /status

⚙️  Environment:
   • Node.js: ${process.version}
   • Port: ${port}
   • PID: ${process.pid}

📝 Logs will appear here...
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...')
  process.exit(0)
})

export default app
