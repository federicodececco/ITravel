const Redis = require("ioredis");

const serverRedisIstance = new Redis({
  port: 6379,
  host: process.env.REDIS_HOST || "localhost",
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

async function testRedis() {
  console.log("Tentativo di connessione a Redis...");

  try {
    await serverRedisIstance.connect();
    console.log("Connesso a Redis con successo!");

    const pong = await serverRedisIstance.ping();
    console.log(pong);

    await serverRedisIstance.set(
      "test:connection",
      JSON.stringify({ timestamp: Date.now() })
    );
    const testData = await serverRedisIstance.get("test:connection");
    console.log(testData);

    await serverRedisIstance.del("test:connection");
  } catch (error) {
    console.error("Errore durante la connessione:", error.message);
  }
}

serverRedisIstance.on("connect", () => {
  console.log("Connessione Redis stabilita");
});

serverRedisIstance.on("error", (error) => {
  console.error("Errore Redis:", error.message);
});

serverRedisIstance.on("reconnecting", () => {
  console.log("Riconnessione a Redis...");
});

module.exports = { serverRedisIstance, testRedis };
