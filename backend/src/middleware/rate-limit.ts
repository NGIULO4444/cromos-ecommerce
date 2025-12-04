import rateLimit from "express-rate-limit"
import { Request, Response } from "express"

// Rate limit generale per API
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 1000, // 1000 richieste per IP ogni 15 minuti
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const logger = (req as any).scope?.resolve("logger")
    if (logger) {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
    }
    
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes"
    })
  }
})

// Rate limit più restrittivo per admin API
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 500, // 500 richieste per IP ogni 15 minuti
  message: {
    error: "Too many admin requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const logger = (req as any).scope?.resolve("logger")
    if (logger) {
      logger.warn(`Admin rate limit exceeded for IP: ${req.ip}`)
    }
    
    res.status(429).json({
      error: "Too many admin requests from this IP, please try again later.",
      retryAfter: "15 minutes"
    })
  }
})

// Rate limit per autenticazione
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // 10 tentativi di login per IP ogni 15 minuti
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Non conta le richieste riuscite
  handler: (req: Request, res: Response) => {
    const logger = (req as any).scope?.resolve("logger")
    if (logger) {
      logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`)
    }
    
    res.status(429).json({
      error: "Too many authentication attempts, please try again later.",
      retryAfter: "15 minutes"
    })
  }
})

// Rate limit per inventory sync (più permissivo per automazioni)
export const inventorySyncRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minuti
  max: 100, // 100 sync per IP ogni 5 minuti
  message: {
    error: "Too many inventory sync requests, please try again later.",
    retryAfter: "5 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const logger = (req as any).scope?.resolve("logger")
    if (logger) {
      logger.warn(`Inventory sync rate limit exceeded for IP: ${req.ip}`)
    }
    
    res.status(429).json({
      error: "Too many inventory sync requests, please try again later.",
      retryAfter: "5 minutes"
    })
  }
})
