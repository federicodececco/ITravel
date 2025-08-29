const express = require("express");
const router = express.Router();
const cacheController = require("../controllers/cacheController");

router.get("/stats", cacheController.getStats);
router.delete("/:type", cacheController.deleteCache);

module.exports = router;
