const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();
const session = require("express-session");


const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));


const authRoutes = require("./routes/authRoutes");
const airtableRoutes = require("./routes/airtableRoutes");
const formRoutes = require("./routes/formRoutes");


app.use("/auth", authRoutes);
app.use("/api/airtable", airtableRoutes);
app.use("/api/forms", formRoutes);


const port = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
});
