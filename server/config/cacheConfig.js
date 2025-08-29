const cache_config = {
  ALL_TRAVELS: {
    key: "travels:all",
    ttl: 300, // 5 minuti
  },
  SEARCH_TRAVELS: {
    key: "travels:search:",
    ttl: 180, // 3 minuti
  },
  USER_TRAVELS: {
    key: "travels:user:",
    ttl: 600, // 10 minuti
  },
};

module.exports = cache_config;
