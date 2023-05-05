const express = require("express");
const router = express.Router();
const moment = require("moment");
const momentTZ = require("moment-timezone");
const { google } = require("googleapis");
const db = require("../db/db.js");

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

// router.post("/auth", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.get("/:year/:month", async (req, res) => {
    const { year, month } = req.params;
    const lastDayOfMonth = new Date(year, month, 0).getDate(); // calculate last day of month dynamically
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${lastDayOfMonth}`; // use dynamically calculated last day of month

    db.all(
        `SELECT lesson.id as lessonId, lesson.roadTest, lesson.startTime, lesson.endTime, lesson.date, lesson.duration, lesson.paymentType, lesson.paymentAmount, lesson.bde, lesson.remarks as lessonRemarks, lesson.studentId,
                student.id as studentId, student.firstName, student.lastName, student.email, student.phoneNumber, student.streetAddress, student.drivingClass, student.remarks as studentRemarks
         FROM lesson
         INNER JOIN student ON lesson.studentId = student.id
         WHERE date BETWEEN ? AND ?`,
        [startDate, endDate],
        (err, rows) => {
            if (err) {
                console.log(err);
                res.status(500).send({
                    error: "An error occurred while fetching data",
                });
            } else {
                const lessons = rows.map((row) => {
                    return {
                        id: row.lessonId,
                        roadTest: row.roadTest,
                        startTime: row.startTime,
                        endTime: row.endTime,
                        date: row.date,
                        duration: row.duration,
                        paymentType: row.paymentType,
                        paymentAmount: row.paymentAmount,
                        bde: row.bde,
                        remarks: row.lessonRemarks,
                        studentId: row.studentId,
                        student: {
                            id: row.studentId,
                            firstName: row.firstName,
                            lastName: row.lastName,
                            email: row.email,
                            phoneNumber: row.phoneNumber,
                            streetAddress: row.streetAddress,
                            drivingClass: row.drivingClass,
                            remarks: row.studentRemarks,
                        },
                    };
                });
                res.send(lessons);
            }
        }
    );
});

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM lesson WHERE id = ?", id, (err, result) => {
        if (err) console.log(err);
        else res.send(result);
    });
});

module.exports = router;
