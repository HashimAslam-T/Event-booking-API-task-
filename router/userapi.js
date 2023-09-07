const express = require("express");
const router = express.Router();
const control = require("../controller/usercontroller")
    
router.post("/addUser",control.postUser);

router.get("/getuserevents",control.getUserEvents);

router.delete("/canceluserevent",control.cancelEvent);

module.exports = router;

