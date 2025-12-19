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
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
];

const modules = {
  eventBus: {
    resolve: process.env.REDIS_URL ? "@medusajs/event-bus-redis" : "@medusajs/event-bus-local",
    options: process.env.REDIS_URL ? {
      redisUrl: process.env.REDIS_URL,
      redisOptions: {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      },
    } : {},
  },
  cacheService: {
    resolve: process.env.REDIS_URL ? "@medusajs/cache-redis" : "@medusajs/cache-inmemory",
    options: process.env.REDIS_URL ? {
      redisUrl: process.env.REDIS_URL,
      ttl: 30,
      redisOptions: {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
      },
    } : {},
  },
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig: {
    jwt_secret: process.env.JWT_SECRET,
    cookie_secret: process.env.COOKIE_SECRET,
    store_cors: STORE_CORS,
    database_url: DATABASE_URL,
    admin_cors: ADMIN_CORS,
  },
  plugins,
  modules,
};