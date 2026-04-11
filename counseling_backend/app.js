// importing required packages
var express = require('express'); 
var path = require('path'); // works with files and  directory
var cookieParser = require('cookie-parser'); // reads cookies from HTTP requests
var logger = require('morgan'); // manages the logs of requests terminal.
var cors = require("cors")

// Importing route handlers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/userRoutes');

// pofile routes handlers
var profileRouter = require("./routes/profileRoutes");
var questionRouter = require("./routes/questionRoutes");
var adminRouter = require("./routes/adminRoutes");
var counselorRouter = require("./routes/counselorRoutes");
var studentRouter = require("./routes/studentRoutes");
var chatRouter = require("./routes/chatRoutes");
var decisionRouter = require("./routes/DecisionRoutes");
var searchRouter = require("./routes/searchRoutes");

// importing socket js from socket IO file
var socket = require("./Socket io/socket"); // giving relative path name



var app = express();

app.use(cors());
// Middleware setup
app.use(logger('dev'));
app.use(express.json()); // convert incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false }));// convert the form data.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));// serves static files from the 'public' directory

// main entry point for routing
app.use('/', indexRouter);
app.use('/users', userRouter);

// main entry point
app.use('/api/profile', profileRouter);
app.use('/api/question', questionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/counselor", counselorRouter);
app.use("/api/student", studentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/decision", decisionRouter);
app.use("/api/search", searchRouter);
// main entry point for socket IO 
app.initSocket = socket.initSocket;
app.getIO = socket.getIO;

// import mongoose for database connection
const mongoose = require("mongoose");

//  asynchronous function to connect to the database
async function main() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI in environment variable is not set.");  

        }
        const data = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "career_counseling"
        });
        console.log("Database connected successfully", data.connection.name);
    } catch (err) {
        console.error("Database connection error:", err);
    }
}
main();



module.exports = app;
