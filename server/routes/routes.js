const express = require("express")
const dotenv = require("dotenv")
const appcontroller = require('../controller/appcontroller')
const cloudinary = require('cloudinary').v2
const middleware = require('../middleware/token-manager')
const middlewareuser = require('../middleware/token-manageruser')
const passport = require("passport")
const OAuth2Strategy = require("passport-google-oauth2").Strategy
const userdb = require('../model/userSchemaG')
const COOKIE_NAME_USER = process.env.COOKIE_NAME_USER;


const routes = express();
dotenv.config();

routes.use(express.urlencoded({ extended: false }));
routes.use(express.json());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))

    },
    filename: function (req, file, cb) {
        const name = Date.now() + '_' + file.originalname
        cb(null, name)
    }
})
const upload = multer({ storage: storage })

passport.use(
    new OAuth2Strategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: "/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let userE = await userdb.findOne({ email: profile.emails[0].value })
                if (!userE) {
                    userE = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value
                    });
                    await userE.save();
                } else {
                    let user = await userdb.findOne({ googleId: profile.id });
                    if (!user) {
                        return done(null, false, { message: "Please use email id and password" });
                    }
                    return done(null, user)
                }

            } catch (error) {
                return done(error, null)
            }
        }
    )
)
passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
});
// initial google ouath login
routes.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
routes.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:5173/test-series",
    failureRedirect: "http://localhost:5173/login"
}))

routes.get("/login/sucess", async (req, res) => {

    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user })
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
})

routes.post("/logout", (req, res, next) => {

    try {
        req.logout(function (err) {
            if (err) { return next(err) }
            return res.status(200).json({ message: "OK" })
        })

        res.clearCookie(COOKIE_NAME_USER, {
            path: "/",
            signed: true,
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
})

routes.post('/createtest', middleware.verifyToken, appcontroller.CreateTest)
routes.post('/updatetest', middleware.verifyToken, appcontroller.UpdateTest)
routes.post('/deletetest', middleware.verifyToken, appcontroller.DeleteTest)
routes.post('/uploadquestion', upload.single('questionimg'), appcontroller.UploadQuestion)
routes.post('/deletequestion', appcontroller.DeleteQuestion)
routes.post('/updatequestion', upload.single('questionimg'), appcontroller.UpdateQuestion)
routes.post('/addinstruction', appcontroller.AddInstruction)
routes.post('/adminlogin', appcontroller.AdminLogin)
routes.post('/adminlogout', appcontroller.AdminLogout)
routes.post('/conducttest', appcontroller.ConductTest)
routes.post('/usersignup', appcontroller.SignUp)
routes.post('/otpverify', appcontroller.OTPverify)
routes.post('/resendotp', appcontroller.ResendOTP)
routes.post('/userlogin', appcontroller.UserLogin)
routes.post('/otpforgot', appcontroller.OtpForgot)
routes.post('/otpverifyforgot', appcontroller.OtpVerifyForgot)
routes.post('/resetpassword', appcontroller.ResetPassword)

routes.get('/', appcontroller.basic)
routes.get('/gettest', middleware.verifyToken, appcontroller.GetTest)
routes.get('/auth-status', middleware.verifyToken, appcontroller.verifyAdmin)
routes.get('/getuserdata', middlewareuser.verifyToken, appcontroller.verifyUser)


module.exports = routes;