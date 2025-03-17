const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const mongoose = require('mongoose');

dotenv.config();  

const app = express();
const port = process.env.PORT || 8000;

routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
    console.log("Connect DB success!");
})
.catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});
