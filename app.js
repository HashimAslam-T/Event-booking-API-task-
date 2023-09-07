const express = require('express');
const router1 = require('./router/userapi');
const router2 = require('./router/eventapis');
const router3 = require('./router/participationapi');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/',router1);
app.use('/',router2);
app.use('/',router3);

app.listen(3000,(err) => {
    if (err) console.log(err);
    else console.log("server runs");
})



