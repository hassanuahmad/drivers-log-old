const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.post("/", (req, res) => {
    const date = req.body.date;
    const odometer = req.body.odometer;
    const fueling = req.body.fueling;
    const gas = req.body.gas;
    const maintenance = req.body.maintenance;
    const remarks = req.body.remarks;

    db.run(
        `INSERT INTO vehicleMaintenance (date, odometer, fueling, gas, maintenance, remarks)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [date, odometer, fueling, gas, maintenance, remarks],
        function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Error saving Vehicle Maintenance");
            } else {
                res.status(200).send("Vehicle Maintenance saved");
            }
        }
    );
});

router.get("/", (req, res) => {
    db.all("SELECT * FROM vehicleMaintenance", (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

router.get("/:year/:month", async (req, res) => {
    const { year, month } = req.params;
    const lastDayOfMonth = new Date(year, month, 0).getDate(); // calculate last day of month dynamically
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${lastDayOfMonth}`; // use dynamically calculated last day of month

    db.all(
        `SELECT * FROM vehicleMaintenance WHERE date BETWEEN ? AND ?`,
        [startDate, endDate],
        (err, result) => {
            if (err) console.log(err);
            else res.send(result);
        }
    );
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const date = req.body.date;
    const odometer = req.body.odometer;
    const fueling = req.body.fueling;
    const gas = req.body.gas;
    const maintenance = req.body.maintenance;
    const remarks = req.body.remarks;

    db.run(
        `UPDATE vehicleMaintenance SET date = ?, odometer = ?, fueling = ?, gas = ?, maintenance = ?, remarks = ? WHERE id = ?`,
        [date, odometer, fueling, gas, maintenance, remarks, id],
        function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Error updating Vehicle Maintenance");
            } else {
                res.status(200).send("Vehicle Maintenance updated");
            }
        }
    );
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM vehicleMaintenance WHERE id = ?", id, (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

module.exports = router;
