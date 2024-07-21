const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require('cors')
const session = require("express-session")
const passport = require("passport")


const PORT = process.env.PORT || 5000;

const app = express();

dotenv.config();
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
require("./db/connection.js");
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({ secret: process.env.COOKIE_SECRET, resave: false, saveUninitialized: true }))

app.use(passport.initialize());
app.use(passport.session());


const Router = require('./routes/routes.js');

app.use('/', Router)


app.listen(PORT, () => {
    console.log(`server running in port no ${PORT}`)
})
