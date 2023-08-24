const sqlite3 = require("sqlite3").verbose();

// Open a connection to the database
const db = new sqlite3.Database("mydb.sqlite");

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

// Create vehicle maintenance table
db.run(`CREATE TABLE IF NOT EXISTS vehicleMaintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      odometer INTEGER NOT NULL,
      fueling INTEGER NOT NULL,
      gas INTEGER NOT NULL,
      maintenance INTEGER NOT NULL,
      remarks TEXT NULL
    )`);

module.exports = db;
