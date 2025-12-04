const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {
  console.log("No .env file found");
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000,http://localhost:3000";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

// Stripe Payment Plugin (disabled for local testing)
// if (process.env.STRIPE_API_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
//   plugins.push({
//     resolve: `medusa-payment-stripe`,
//     options: {
//       api_key: process.env.STRIPE_API_KEY,
//       webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
//       automatic_payment_methods: true,
//       payment_description: "Cromos E-commerce Payment",
//     },
//   });
// }

// Email Plugin (Brevo/SendGrid) - disabled for local testing
// if (process.env.SENDGRID_API_KEY) {
//   plugins.push({
//     resolve: `medusa-plugin-sendgrid`,
//     options: {
//       api_key: process.env.SENDGRID_API_KEY,
//       from: process.env.SENDGRID_FROM || "noreply@cromos.com",
//       order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
//       order_shipped_template: process.env.SENDGRID_ORDER_SHIPPED_ID,
//       user_password_reset_template: process.env.SENDGRID_USER_PASSWORD_RESET_ID,
//       gift_card_created_template: process.env.SENDGRID_GIFT_CARD_CREATED_ID,
//       order_canceled_template: process.env.SENDGRID_ORDER_CANCELED_ID,
//       order_refund_created_template: process.env.SENDGRID_ORDER_REFUND_CREATED_ID,
//       order_return_requested_template: process.env.SENDGRID_ORDER_RETURN_REQUESTED_ID,
//       order_items_returned_template: process.env.SENDGRID_ORDER_ITEMS_RETURNED_ID,
//       swap_created_template: process.env.SENDGRID_SWAP_CREATED_ID,
//       swap_shipment_created_template: process.env.SENDGRID_SWAP_SHIPMENT_CREATED_ID,
//       swap_received_template: process.env.SENDGRID_SWAP_RECEIVED_ID,
//       claim_shipment_created_template: process.env.SENDGRID_CLAIM_SHIPMENT_CREATED_ID,
//       medusa_restock_template: process.env.SENDGRID_MEDUSA_RESTOCK_ID,
//     },
//   });
// }

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-local"
  },
  cacheService: {
    resolve: "@medusajs/cache-inmemory"
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  cookieSecret: process.env.COOKIE_SECRET || "supersecret",
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Redis disabled for local development
  // redis_url: REDIS_URL,
  database_logging: process.env.NODE_ENV !== "production",
  database_extra: process.env.NODE_ENV !== "production" ? {} : {
    ssl: { rejectUnauthorized: false }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
