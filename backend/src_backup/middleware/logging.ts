import { Request, Response, NextFunction } from "express"
import { MedusaRequest } from "@medusajs/medusa"

export function loggingMiddleware() {
  return (req: MedusaRequest, res: Response, next: NextFunction) => {
    const logger = req.scope?.resolve("logger")
    
    if (!logger) {
      return next()
    }

    const start = Date.now()
    const { method, url, ip } = req
    const userAgent = req.get("User-Agent") || "Unknown"

    // Log della richiesta in entrata
    logger.info(`${method} ${url}`, {
      ip,
      userAgent,
      timestamp: new Date().toISOString()
    })

    // Override del metodo res.end per loggare la risposta
    const originalEnd = res.end
    res.end = function(chunk?: any, encoding?: any) {
      const duration = Date.now() - start
      const { statusCode } = res
      
      // Log della risposta
      logger.info(`${method} ${url} - ${statusCode}`, {
        duration: `${duration}ms`,
        statusCode,
        ip,
        timestamp: new Date().toISOString()
      })

      // Log di errore per status code >= 400
      if (statusCode >= 400) {
        logger.error(`Error response: ${method} ${url}`, {
          statusCode,
          duration: `${duration}ms`,
          ip,
          userAgent
        })
      }

      originalEnd.call(this, chunk, encoding)
    }

    next()
  }
}
