const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();  

const app = express();
const port = process.env.PORT || 8000;

routes(app);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});
