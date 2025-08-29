const redis = require("../config/redis");
const serverRedis = redis.serverRedisIstance;

const serialize = (data) => JSON.stringify(data);

const deserialize = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Errore deserializzazione:", error);
    return null;
  }
};

const generateKey = (prefix, suffix) => `${prefix}${suffix}`;

const exists = async (key) => {
  try {
    return await serverRedis.exists(key);
  } catch (error) {
    console.error("Errore controllo esistenza chiave:", error);
    return false;
  }
};

module.exports = { serialize, deserialize, generateKey, exists };
