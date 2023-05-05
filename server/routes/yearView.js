const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.get("/:year", async (req, res) => {
    const { year } = req.params;

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const lessonsQuery = new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM lesson WHERE date BETWEEN ? AND ?`,
            [startDate, endDate],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });

    const distinctStudentsQuery = new Promise((resolve, reject) => {
        db.all(
            `SELECT DISTINCT studentId FROM lesson WHERE date BETWEEN ? AND ?`,
            [startDate, endDate],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });

    const maintenanceQuery = new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM vehicleMaintenance WHERE date BETWEEN ? AND ?`,
            [startDate, endDate],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });

    try {
        const [lessons, distinctStudents, maintenance] = await Promise.all([
            lessonsQuery,
            distinctStudentsQuery,
            maintenanceQuery,
        ]);

        const uniqueStudentCount = distinctStudents.length;

        res.send({ lessons, uniqueStudentCount, maintenance });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            error: "An error occurred while fetching data",
        });
    }
});

module.exports = router;
