const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const streetAddress = req.body.streetAddress;
    const email = req.body.email;
    const drivingClass = req.body.drivingClass;
    const remarks = req.body.remarks;

    db.run(
        `INSERT INTO student (firstName, lastName, phoneNumber, streetAddress, email, drivingClass, remarks)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            firstName,
            lastName,
            phoneNumber,
            streetAddress,
            email,
            drivingClass,
            remarks,
        ],
        function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Error saving student");
            } else {
                res.status(200).send("Student saved");
            }
        }
    );
});

router.get("/", (req, res) => {
    db.all("SELECT * FROM student", (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const streetAddress = req.body.streetAddress;
    const email = req.body.email;
    const drivingClass = req.body.drivingClass;
    const remarks = req.body.remarks;

    db.run(
        `UPDATE student SET
          firstName = ?,
          lastName = ?,
          phoneNumber = ?,
          streetAddress = ?,
          email = ?,
          drivingClass = ?,
          remarks = ?
          WHERE id = ?`,
        [
            firstName,
            lastName,
            phoneNumber,
            streetAddress,
            email,
            drivingClass,
            remarks,
            id,
        ],
        function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Error updating student");
            } else {
                res.status(200).send("Student updated");
            }
        }
    );
});

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    // First, check if there are any lessons associated with the student
    const checkLessons = "SELECT * FROM lesson WHERE studentId = ?";
    db.all(checkLessons, [id], (err, lessons) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error checking for associated lessons");
        } else {
            // If there are associated lessons, send an error message
            if (lessons.length > 0) {
                res.status(400).send(
                    "Cannot delete student. There are lessons associated with the student. Please delete the lessons first."
                );
            } else {
                // If there are no associated lessons, delete the student
                const deleteStudent = "DELETE FROM student WHERE id = ?";
                db.run(deleteStudent, [id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Error deleting student");
                    } else {
                        res.status(200).send("Student deleted successfully");
                    }
                });
            }
        }
    });
});

module.exports = router;
