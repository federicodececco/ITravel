const cache_config = require("../config/cacheConfig");
const redis = require("../config/redis");
const cacheUtils = require("../utils/cacheUtils");

const serverRedis = redis.serverRedisIstance;

const getStats = async (req, res) => {
  try {
    const stats = {
      allTravels: await cacheUtils.exists(cache_config.ALL_TRAVELS.key),
      searchQueries: (
        await serverRedis.keys(`${cache_config.SEARCH_TRAVELS.key}*`)
      ).length,
      userCaches: (await serverRedis.keys(`${cache_config.USER_TRAVELS.key}*`))
        .length,
      totalKeys: (await serverRedis.keys("travels:*")).length,
      redisInfo: await serverRedis.info("memory"),
    };

    res.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("Errore statistiche cache:", error);
    res.status(500).json({
      success: false,
      error: "Errore recupero statistiche",
    });
  }
};

const deleteCache = async (req, res) => {
  try {
    const { type } = req.params;
    let pattern;

    switch (type) {
      case "all":
        pattern = cache_config.ALL_TRAVELS.key;
        break;
      case "search":
        pattern = `${cache_config.SEARCH_TRAVELS.key}*`;
        break;
      case "users":
        pattern = `${cache_config.USER_TRAVELS.key}*`;
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Tipo cache non valido",
        });
    }

    if (pattern.includes("*")) {
      const keys = await serverRedis.keys(pattern);
      if (keys.length > 0) {
        await serverRedis.del(...keys);
      }
    } else {
      await serverRedis.del(pattern);
    }

    res.json({
      success: true,
      message: `Cache ${type} invalidata`,
    });
  } catch (error) {
    console.error("Errore invalidazione cache:", error);
    res.status(500).json({
      success: false,
      error: "Errore invalidazione cache",
    });
  }
};

module.exports = { getStats, deleteCache };
