const express = require("express");
const router = express.Router();
const travelController = require("../controllers/travelController");

router.get("/", travelController.getTravels);
router.post("/cache", travelController.postTravelsCache);

module.exports = router;
