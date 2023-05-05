const express = require("express");
const cors = require("cors");
require("dotenv").config();

const lessonRoutes = require("./routes/lesson");
const studentRoutes = require("./routes/student");
const vehicleMaintenanceRoutes = require("./routes/vehicleMaintenance");
const yearViewRoutes = require("./routes/yearView");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/yearView", yearViewRoutes);
app.use("/", lessonRoutes);
app.use("/student", studentRoutes);
app.use("/vehicleMaintenance", vehicleMaintenanceRoutes);

// Close the connection to the database when the app exits
process.on("exit", () => {
    const db = require("./db/db");
    db.close();
});

app.listen(3000, () => {
    console.log("Server on 3000");
});
