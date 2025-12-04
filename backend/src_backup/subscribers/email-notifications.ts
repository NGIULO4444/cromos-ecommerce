import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  OrderService,
  CustomerService,
} from "@medusajs/medusa"
import EmailTemplatesService from "../services/email-templates"

export default async function emailNotificationHandler({ 
  data, 
  eventName, 
  container, 
  pluginOptions,
}: SubscriberArgs<Record<string, any>>) {
  const logger = container.resolve("logger")
  const emailTemplatesService = new EmailTemplatesService()

  try {
    switch (eventName) {
      case "order.placed":
        await handleOrderPlaced(data, container, emailTemplatesService)
        break
      case "order.shipment_created":
        await handleOrderShipped(data, container, emailTemplatesService)
        break
      case "customer.created":
        await handleCustomerWelcome(data, container, emailTemplatesService)
        break
      case "customer.password_reset":
        await handlePasswordReset(data, container, emailTemplatesService)
        break
      default:
        logger.info(`Unhandled email notification event: ${eventName}`)
    }
  } catch (error) {
    logger.error(`Email notification handler failed for event ${eventName}:`, error)
  }
}

async function handleOrderPlaced(data: any, container: any, emailService: EmailTemplatesService) {
  const logger = container.resolve("logger")
  const orderService: OrderService = container.resolve("orderService")
  const sendGridService = container.resolve("sendgridService")

  try {
    const order = await orderService.retrieve(data.id, {
      relations: [
        "items", 
        "items.variant", 
        "customer", 
        "billing_address", 
        "shipping_address",
        "shipping_methods",
        "payments"
      ]
    })

    logger.info(`Sending order confirmation email for order: ${order.id}`)

    // Prepara dati per template
    const templateData = {
      customer_first_name: order.customer?.first_name || order.billing_address?.first_name || 'Cliente',
      customer_email: order.email,
      order_number: order.display_id,
      order_date: new Date(order.created_at).toLocaleDateString('it-IT'),
      items: order.items.map(item => ({
        title: item.title,
        variant_sku: item.variant?.sku || 'N/A',
        variant_title: item.variant?.title || 'Default',
        quantity: item.quantity,
        unit_price_formatted: formatPrice(item.unit_price),
        total_formatted: formatPrice(item.total)
      })),
      subtotal_formatted: formatPrice(order.subtotal),
      shipping_total_formatted: formatPrice(order.shipping_total),
      tax_total_formatted: formatPrice(order.tax_total),
      total_formatted: formatPrice(order.total),
      shipping_address: order.shipping_address,
      billing_address: order.billing_address,
      order_tracking_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${order.id}`
    }

    // Invia email usando template
    const template = emailService.getTemplate('order_placed')
    if (template) {
      await sendGridService.sendEmail({
        to: order.email,
        from: process.env.SENDGRID_FROM || 'noreply@cromos.com',
        templateId: process.env.SENDGRID_ORDER_PLACED_ID,
        dynamicTemplateData: templateData
      })

      logger.info(`Order confirmation email sent to: ${order.email}`)
    }

  } catch (error) {
    logger.error("Failed to send order confirmation email:", error)
  }
}

async function handleOrderShipped(data: any, container: any, emailService: EmailTemplatesService) {
  const logger = container.resolve("logger")
  const orderService: OrderService = container.resolve("orderService")
  const fulfillmentService = container.resolve("fulfillmentService")
  const sendGridService = container.resolve("sendgridService")

  try {
    const fulfillment = await fulfillmentService.retrieve(data.id, {
      relations: ["order", "order.customer", "order.shipping_address", "tracking_links"]
    })

    const order = fulfillment.order

    logger.info(`Sending shipment notification for order: ${order.id}`)

    // Estrai informazioni tracking
    const trackingNumber = fulfillment.tracking_numbers?.[0] || 'N/A'
    const trackingUrl = fulfillment.tracking_links?.[0]?.url || '#'

    const templateData = {
      customer_first_name: order.customer?.first_name || order.shipping_address?.first_name || 'Cliente',
      customer_email: order.email,
      order_number: order.display_id,
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
      shipping_carrier: fulfillment.provider_id || 'Corriere',
      shipping_method: order.shipping_methods?.[0]?.shipping_option?.name || 'Standard',
      shipped_date: new Date(fulfillment.shipped_at || fulfillment.created_at).toLocaleDateString('it-IT'),
      estimated_delivery: calculateEstimatedDelivery(fulfillment.created_at),
      shipping_address: order.shipping_address
    }

    const template = emailService.getTemplate('order_shipped')
    if (template) {
      await sendGridService.sendEmail({
        to: order.email,
        from: process.env.SENDGRID_FROM || 'noreply@cromos.com',
        templateId: process.env.SENDGRID_ORDER_SHIPPED_ID,
        dynamicTemplateData: templateData
      })

      logger.info(`Shipment notification sent to: ${order.email}`)
    }

  } catch (error) {
    logger.error("Failed to send shipment notification:", error)
  }
}

async function handleCustomerWelcome(data: any, container: any, emailService: EmailTemplatesService) {
  const logger = container.resolve("logger")
  const customerService: CustomerService = container.resolve("customerService")
  const sendGridService = container.resolve("sendgridService")

  try {
    const customer = await customerService.retrieve(data.id)

    logger.info(`Sending welcome email to new customer: ${customer.email}`)

    const templateData = {
      customer_first_name: customer.first_name || 'Cliente',
      customer_email: customer.email,
      shop_url: process.env.NEXT_PUBLIC_BASE_URL || 'https://cromos.com'
    }

    const template = emailService.getTemplate('welcome')
    if (template) {
      await sendGridService.sendEmail({
        to: customer.email,
        from: process.env.SENDGRID_FROM || 'noreply@cromos.com',
        subject: template.subject,
        html: compileTemplate(template.html, templateData),
        text: compileTemplate(template.text || '', templateData)
      })

      logger.info(`Welcome email sent to: ${customer.email}`)
    }

  } catch (error) {
    logger.error("Failed to send welcome email:", error)
  }
}

async function handlePasswordReset(data: any, container: any, emailService: EmailTemplatesService) {
  const logger = container.resolve("logger")
  const sendGridService = container.resolve("sendgridService")

  try {
    const { email, token, first_name } = data

    logger.info(`Sending password reset email to: ${email}`)

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

    const templateData = {
      customer_first_name: first_name || 'Cliente',
      customer_email: email,
      reset_url: resetUrl
    }

    const template = emailService.getTemplate('password_reset')
    if (template) {
      await sendGridService.sendEmail({
        to: email,
        from: process.env.SENDGRID_FROM || 'noreply@cromos.com',
        templateId: process.env.SENDGRID_USER_PASSWORD_RESET_ID,
        dynamicTemplateData: templateData
      })

      logger.info(`Password reset email sent to: ${email}`)
    }

  } catch (error) {
    logger.error("Failed to send password reset email:", error)
  }
}

// Utility functions
function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100)
}

function calculateEstimatedDelivery(shippedDate: string): string {
  const shipped = new Date(shippedDate)
  const estimated = new Date(shipped)
  estimated.setDate(shipped.getDate() + 2) // +2 giorni lavorativi
  
  return estimated.toLocaleDateString('it-IT')
}

function compileTemplate(template: string, data: Record<string, any>): string {
  // Simple template compilation (in produzione usa Handlebars o simili)
  let compiled = template
  
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    compiled = compiled.replace(regex, String(value || ''))
  }
  
  // Handle nested objects (e.g., shipping_address.first_name)
  const nestedRegex = /{{(\w+)\.(\w+)}}/g
  compiled = compiled.replace(nestedRegex, (match, obj, prop) => {
    return data[obj]?.[prop] || ''
  })
  
  return compiled
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "order.shipment_created",
    "customer.created",
    "customer.password_reset"
  ],
  context: {
    subscriberId: "email-notifications-handler",
  },
}
