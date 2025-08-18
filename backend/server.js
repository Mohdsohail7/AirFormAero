const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
});
