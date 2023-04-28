const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(cors());
app.use(express.json());

// Open a connection to the database
// test DB
const db = new sqlite3.Database("mydb.sqlite");
// production DB
// const db = new sqlite3.Database("db.sqlite");

// create the student table
db.run(`CREATE TABLE IF NOT EXISTS student (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  phoneNumber TEXT NOT NULL,
  streetAddress TEXT NOT NULL,
  email TEXT NULL,
  drivingClass TEXT NOT NULL,
  remarks TEXT NULL
)`);

// Create lesson table
db.run(`CREATE TABLE IF NOT EXISTS lesson (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  studentId INTEGER NOT NULL,
  roadTest TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  date DATE NOT NULL,
  duration TEXT NOT NULL,
  paymentType TEXT NOT NULL,
  paymentAmount TEXT NOT NULL,
  bde TEXT NOT NULL,
  remarks TEXT NULL,
  FOREIGN KEY (studentId) REFERENCES student(id)
)`);

// Create lesson table
db.run(`CREATE TABLE IF NOT EXISTS vehicleMaintenance (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	date TEXT NOT NULL,
	odometer INTEGER NOT NULL,
	fueling INTEGER NOT NULL,
	gas INTEGER NOT NULL,
	maintenance INTEGER NOT NULL,
	remarks TEXT NULL
  )`);

app.post("/student", (req, res) => {
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

app.get("/student", (req, res) => {
    db.all("SELECT * FROM student", (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

app.get("/student/:id", (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM student WHERE id = ?", id, (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Error retrieving student information");
        } else if (!row) {
            res.status(404).send("Student not found");
        } else {
            res.status(200).json(row);
            // res.send(row);
        }
    });
});

app.put("/student/:id", (req, res) => {
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

app.delete("/student/:id", (req, res) => {
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

app.get("/yearView/:year", async (req, res) => {
    console.log("Year route called");

    const { year } = req.params;

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    console.log(year, startDate, endDate);

    db.all(
        `SELECT * FROM lesson WHERE date BETWEEN ? AND ?`,
        [startDate, endDate],
        (err, result) => {
            if (err) console.log(err);
            else res.send(result);
        }
    );
});

app.post("/", (req, res) => {
    const studentId = parseInt(req.body.selectStudent);
    const roadTest = req.body.roadTest;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const date = req.body.date;
    const paymentType = req.body.paymentType;
    const paymentAmount = req.body.paymentAmount;
    const bde = req.body.bde;
    const remarks = req.body.remarks;

    // Get the duration of the lesson
    const start = new Date(`2000-01-01T${startTime}:00Z`);
    const end = new Date(`2000-01-01T${endTime}:00Z`);
    // calculate the duration in milliseconds by subtracting the start time from the end time
    const durationInMs = end - start;
    // convert the duration from milliseconds to hours
    const durationInHrs = durationInMs / (1000 * 60 * 60);
    // calculate the remaining duration in minutes
    const durationInMins = Math.floor((durationInHrs % 1) * 60);
    const duration = `${Math.floor(durationInHrs)}h ${durationInMins}m`;

    db.run(
        `INSERT INTO lesson (studentId, roadTest, startTime, endTime, date, duration, paymentType, paymentAmount, bde, remarks)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            studentId,
            roadTest,
            startTime,
            endTime,
            date,
            duration,
            paymentType,
            paymentAmount,
            bde,
            remarks,
        ],
        function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Error saving lesson");
            } else {
                res.status(200).send("Lesson saved");
            }
        }
    );
});

app.get("/", (req, res) => {
    db.all("SELECT * FROM lesson", (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

app.get("/:year/:month", async (req, res) => {
    const { year, month } = req.params;
    const lastDayOfMonth = new Date(year, month, 0).getDate(); // calculate last day of month dynamically
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${lastDayOfMonth}`; // use dynamically calculated last day of month

    db.all(
        `SELECT * FROM lesson WHERE date BETWEEN ? AND ?`,
        [startDate, endDate],
        (err, result) => {
            if (err) console.log(err);
            else res.send(result);
        }
    );
});

app.put("/:id", (req, res) => {
    const id = req.params.id;
    const studentId = req.body.studentId;
    const roadTest = req.body.roadTest;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const date = req.body.date;
    const paymentType = req.body.paymentType;
    const paymentAmount = req.body.paymentAmount;
    const bde = req.body.bde;
    const remarks = req.body.remarks;

    // Get the duration of the lesson
    const start = new Date(`2000-01-01T${startTime}:00Z`);
    const end = new Date(`2000-01-01T${endTime}:00Z`);
    // calculate the duration in milliseconds by subtracting the start time from the end time
    const durationInMs = end - start;
    // convert the duration from milliseconds to hours
    const durationInHrs = durationInMs / (1000 * 60 * 60);
    // calculate the remaining duration in minutes
    const durationInMins = Math.floor((durationInHrs % 1) * 60);
    const duration = `${Math.floor(durationInHrs)}h ${durationInMins}m`;

    db.run(
        `UPDATE lesson SET
             studentId = ?,
             roadTest = ?,
             startTime = ?,
             endTime = ?,
             date = ?,
             duration = ?,
             paymentType = ?,
             paymentAmount = ?,
             bde = ?,
             remarks = ?
         WHERE id = ?`,
        [
            studentId,
            roadTest,
            startTime,
            endTime,
            date,
            duration,
            paymentType,
            paymentAmount,
            bde,
            remarks,
            id,
        ],
        function (err) {
            if (err) {
                console.log(err.message);
                res.status(500).send("Error updating lesson");
            } else {
                res.status(200).send("Lesson updated");
            }
        }
    );
});

app.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM lesson WHERE id = ?", id, (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

app.post("/vehicleMaintenance", (req, res) => {
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

app.get("/vehicleMaintenance", (req, res) => {
    db.all("SELECT * FROM vehicleMaintenance", (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

app.get("/vehicleMaintenance/:year/:month", async (req, res) => {
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

app.put("/vehicleMaintenance/:id", (req, res) => {
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

app.delete("/vehicleMaintenance/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM vehicleMaintenance WHERE id = ?", id, (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

// Close the connection to the database when the app exits
process.on("exit", () => {
    db.close();
});

app.listen(3000, () => {
    console.log("Server on 3000");
});
