const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const moment = require("moment");
const momentTZ = require("moment-timezone");
const { google } = require("googleapis");
require("dotenv").config();

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

const SCOPES = "https://www.googleapis.com/auth/calendar";
// refresh the access token after 45ish minutes
const refreshToken = process.env.REFRESH_TOKEN;
let accessToken;

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
    refresh_token: refreshToken,
});

// app.post("/auth", async (req, res) => {
//     accessToken = req.body.accessToken;
//     const url = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: SCOPES,
//     });
//     console.log("URL:", url);
//     res.redirect(url);
// });

// this function will return the detail of the student with the given id for the event
const getStudentInfo = (studentId) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM student WHERE id = ?`,
            [studentId],
            (err, student) => {
                if (err) {
                    reject(err);
                } else {
                    if (!student) {
                        reject(new Error("Student not found"));
                    }
                    resolve(student);
                }
            }
        );
    });
};

app.post("/", async (req, res) => {
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
    const startDateTime = moment(`${date}T${startTime}`);
    const endDateTime = moment(`${date}T${endTime}`);

    const totalTuration = moment.duration(endDateTime.diff(startDateTime));
    const durationHours = Math.floor(totalTuration.asHours());
    const durationMinutes = Math.floor(totalTuration.asMinutes()) % 60;

    const duration = `${durationHours}h ${durationMinutes}m`;

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
                console.log("Lesson saved");
                // res.status(200).send("Lesson saved");
            }
        }
    );

    try {
        const studentInfo = await getStudentInfo(studentId);

        // Get the date, time and timezone of the start and end of the lesson for the Calendar API event
        const startTimeInTimeZone = momentTZ
            .tz(`${date}T${startTime}`, "America/Toronto")
            .format();
        const endTimeInTimeZone = momentTZ
            .tz(`${date}T${endTime}`, "America/Toronto")
            .format();

        const eventData = {
            summary: `${studentInfo.firstName} ${studentInfo.lastName}`,
            location: `${studentInfo.streetAddress}`,
            description: `${remarks}`,
            start: {
                dateTime: startTimeInTimeZone,
                timeZone: "America/Toronto",
            },
            end: {
                dateTime: endTimeInTimeZone,
                timeZone: "America/Toronto",
            },
        };

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        await calendar.events.insert({
            calendarId: "primary",
            auth: oauth2Client,
            resource: eventData,
        });

        console.log(`Event created!`);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error creating event:", error);
        res.sendStatus(500);
    }
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
