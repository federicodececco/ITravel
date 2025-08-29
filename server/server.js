const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const redis = require("./config/redis");
const travelRouter = require("./routers/travelRouter");
const cacheRouter = require("./routers/cacheRouter");

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

server.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
server.use(express.json({ limit: "10mb" }));

server.use("/api/travels", travelRouter);
server.use("/api/cache", cacheRouter);

async function startServer() {
  try {
    await redis.testRedis();

    server.listen(PORT, () => {
      console.log(`Server in ascolto sulla porta ${PORT}`);
      console.log(
        `database Redis: ${process.env.REDIS_HOST || "localhost"}:6379`
      );
    });
  } catch (error) {
    console.error("Errore avvio server:", error);
    process.exit(1);
  }
}

startServer();
