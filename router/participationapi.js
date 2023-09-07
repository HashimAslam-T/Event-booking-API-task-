const express = require("express");
const router = express.Router();
const control = require("../controller/participationcontroller")

router.post("/joinevent",control.joinEvent);
module.exports = router;
