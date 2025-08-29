const cache_config = require("../config/cacheConfig");
const redis = require("../config/redis");
const cacheUtils = require("../utils/cacheUtils");

const serverRedis = redis.serverRedisIstance;

const getTravels = async (req, res) => {
  try {
    const cacheKey = cache_config.ALL_TRAVELS.key;

    const cachedData = await serverRedis.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: cacheUtils.deserialize(cachedData),
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    console.log("Cache miss");
    return res.status(202).json({
      success: false,
      message: "Cache miss - fetch from database required",
      cached: false,
    });
  } catch (error) {
    console.error("Errore recupero viaggi:", error);
    res.status(500).json({
      success: false,
      error: "Errore interno del server",
    });
  }
};

const postTravelsCache = async (req, res) => {
  try {
    const { travels } = req.body;

    if (!travels || !Array.isArray(travels)) {
      return res.status(400).json({
        success: false,
        error: "Dati viaggi non validi",
      });
    }

    const cacheKey = cache_config.ALL_TRAVELS.key;
    const serializedData = cacheUtils.serialize(travels);

    await serverRedis.setex(
      cacheKey,
      cache_config.ALL_TRAVELS.ttl,
      serializedData
    );

    res.json({
      success: true,
      message: "Viaggi salvati in cache",
      count: travels.length,
      ttl: cache_config.ALL_TRAVELS.ttl,
    });
  } catch (error) {
    console.error("Errore salvataggio cache viaggi:", error);
    res.status(500).json({
      success: false,
      error: "Errore salvataggio cache",
    });
  }
};

module.exports = { getTravels, postTravelsCache };
