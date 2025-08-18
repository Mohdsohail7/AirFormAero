const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const airtableRoutes = require("./routes/airtableRoutes");
const formRoutes = require("./routes/formRoutes");
const responseControllerRoutes = require("./routes/responseRoutes");
const formViewerRoutes = require("./routes/formViewerRoutes");


app.use("/auth/airtable", authRoutes);
app.use("/api/airtable", airtableRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/response", responseControllerRoutes);
app.use("/api/form-viewer", formViewerRoutes);


const port = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
});
