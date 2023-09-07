const express = require("express");
const router = express.Router();
const control = require("../controller/eventcontroller")
    
router.post("/addEvent",control.postEvent);


router.get("/ongoingevents",control.getOngoingParticipants);

module.exports = router;