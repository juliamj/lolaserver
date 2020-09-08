const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors())
app.use(express.json())

//DB Config
require("dotenv").config();
require("./database/client");

//Bodyparser Middlware
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: false
// }));

//Routes
app.get("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/matches", require("./routes/matches"));
app.use("/profiles", require("./routes/profiles"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
