const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

//For multer to use public folder
app.use("/public", express.static("public"));

//DB Config
require("dotenv").config();
require("./database/client");

//EJS Middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser Middlware
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

// //Express Session
// app.use(
//   session({
//     secret: "secret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

//Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());

//Connect flash
// app.use(flash());

// // Global Variables
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   res.locals.error = req.flash("error");
//   next();
// });

//Routes
app.get("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/matches", require("./routes/matches"));
app.use("/profiles", require("./routes/profiles"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
