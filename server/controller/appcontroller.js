const Test = require('../model/ttmodal');
const cloudinary = require('cloudinary').v2
const Admin = require('../model/adminSchema')
const COOKIE_NAME = process.env.COOKIE_NAME;
const jwt = require('jsonwebtoken')
const User = require('../model/userSchemaG')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const COOKIE_NAME_USER = process.env.COOKIE_NAME_USER;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});
const basic = (req, res) => {
    res.send('hello from server')
}
const createToken = (id, username, expiresIn) => {
    const payload = { id, username }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
}

const CreateTest = async (req, res) => {
    try {
        const { papername, course, noofquestions, noofsections, examduration, totalmarks, } = req.body;

        const newTest = new Test({
            paper_name: papername,
            course,
            totalmarks,
            no_of_questions: noofquestions,
            no_of_sections: noofsections,
            exam_duration: examduration,
        });
        await newTest.save();

        return res.status(200).json({ message: "OK" })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const UpdateTest = async (req, res) => {
    try {
        const { id, papername, course, totalmarks, noofquestions, noofsections, examduration } = req.body;
        const update = {
            paper_name: papername,
            course, totalmarks,
            no_of_questions: noofquestions,
            no_of_sections: noofsections,
            exam_duration: examduration,
        }
        const tests = await Test.findByIdAndUpdate(id, update, { new: true })

        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const DeleteTest = async (req, res) => {
    try {
        const { id } = req.body;
        const tests = await Test.findByIdAndDelete(id);
        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        return res.status(200).json(tests)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const GetTest = async (req, res) => {
    try {
        const tests = await Test.find();
        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        return res.status(200).json(tests)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UploadQuestion = async (req, res) => {
    try {
        const { selectedType, ans, id, marks, negativemarks } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profilepic',
            resource_type: 'auto'
        });
        const UploadQuestion = await Test.findOne({ _id: id })

        UploadQuestion.questions = [...UploadQuestion.questions
            , {
            question: result.secure_url,
            selectedType,
            ans, marks, negativemarks
        }];
        await UploadQuestion.save();
        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const DeleteQuestion = async (req, res) => {
    try {
        const { questionid, id } = req.body;

        await Test.findByIdAndUpdate(
            id,
            { $pull: { questions: { _id: questionid } } },
            { new: true }
        );
        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UpdateQuestion = async (req, res) => {
    try {
        const { questionID, id, selectedType, ans, marks, negativemarks } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profilepic',
            resource_type: 'auto'
        });

        const updates = {
            question: result.secure_url,
            selectedType,
            ans, marks, negativemarks
        }

        const test = await Test.findOneAndUpdate(
            { _id: id, "questions._id": questionID },
            { $set: { "questions.$": updates } },
            { new: true, useFindAndModify: false }
        );
        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const AddInstruction = async (req, res) => {
    try {
        const { instructions, id } = req.body;
        const tests = await Test.findByIdAndUpdate(id, { marking_scheme_instructions: instructions }, { new: true })

        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        return res.status(200)


    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const AdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Admin.findOne({ username: username })
        if (user) {
            if (user.password === password) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 7)
                const token = createToken(user._id.toString(), user.username, "7d")
                res.cookie(COOKIE_NAME, token, {
                    path: "/", expires,
                    signed: true,
                })
                return res.status(200).json({ message: "OK" })
            } else {
                errorMessage = 'You are not authorized to login!';
                return res.send({ error: errorMessage });
            }
        } else {
            errorMessage = 'You are not authorized to login!';
            return res.send({ error: errorMessage });
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const verifyAdmin = async (req, res) => {
    try {

        const user = await Admin.findById(res.locals.jwtData.id)
        if (!user) {
            return res.status(401).send("Admin not registred OR Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Premissions didn't match");
        }

        return res.status(200).json({
            message: "OK", id: user._id.toString(), username: user.username
        })
    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}
const AdminLogout = (req, res) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            signed: true,
        })
        return res.status(200).json({ message: "OK" })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const ConductTest = async (req, res) => {
    try {
        const { id } = req.body;

        const update = {
            status: "live",
            conduct_time: new Date()
        }
        const tests = await Test.findByIdAndUpdate(id, update, { new: true })

        if (!tests) {
            return res.status(401).send("Something went wrong!!");
        }
        return res.status(200)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const SignUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            let errorMessage = '';
            if (existingUser.email === email) {
                errorMessage = 'Email already exists';
            }
            return res.send({ error: errorMessage });
        } else {
            const newUser = new User({
                email, password: hashedPassword, otp: otpcode
            });
            await newUser.save();
            sendOTP(email, otpcode)
            setTimeout(async () => {
                await User.findOneAndDelete({ email: email })
            }, 1800000)


            return res.status(200).json({ message: "OK", email: email })

        }
    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}


const sendOTP = (email, otpcode) => {
    const mailOptions = {
        from: 'mk366114@gmail.com',
        to: email,
        subject: 'Email otp verification',
        html: `<p>Thank you to join divergent classes. Your OTP for email verification is <b>${otpcode}</b></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

const OTPverify = async (req, res) => {
    try {

        const { otp, tempemail } = req.body;
        const newUser = await User.findOne({ email: tempemail })

        if (newUser.otp === otp.toString()) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7)
            const token = createToken(newUser._id.toString(), newUser.email, "7d")
            res.cookie(COOKIE_NAME_USER, token, {
                path: "/", expires,
                signed: true,
            })


            await User.updateOne({ email: tempemail }, {
                $set: {
                    isVerifiedEmail: true
                }
            });

            return res.status(200).json({ message: "OK" })
        } else {
            let errorMessage = 'Incorrect OTP';
            return res.send({ error: errorMessage });
        }



    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const ResendOTP = async (req, res) => {
    try {

        const { tempemail } = req.body;
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);

        const userExist = await User.findOneAndUpdate({ email: tempemail },
            { $set: { "otp": otpcode } },
            { new: true });

        if (userExist) {
            sendOTP(tempemail, otpcode)
            const message = "otp resent"
            return res.send({ resend: message });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const verifyUser = async (req, res) => {
    try {

        const user = await User.findById(res.locals.jwtDataUser.id)
        if (!user) {
            return res.status(401).send("User not registred OR Token Malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtDataUser.id) {
            return res.status(401).send("Premissions didn't match");
        }

        return res.status(200).json({
            message: "OK", id: user._id.toString(), email: user.email
        })
    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!user && !user.isVerifiedEmail) {
            errorMessage = 'User not found';
            return res.send({ error: errorMessage });
        } else if (!isPasswordMatch) {
            errorMessage = 'Incorrect password';
            return res.send({ error: errorMessage });
        } else {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7)
            const token = createToken(user._id.toString(), user.email, "7d")
            res.cookie(COOKIE_NAME_USER, token, {
                path: "/", expires,
                signed: true,
            })
            return res.status(200).json({ message: "OK" })
        }

    } catch (err) {
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const OtpForgot = async (req, res) => {
    try {
        const { email } = req.body;
        let min = 1111;
        let max = 9999;
        let step1 = max - min + 1
        let otpcode = Math.floor((Math.random() * step1) + min);

        const user = await User.findOneAndUpdate({ email: email }, {
            $set: { otp: otpcode }
        }, { new: true })

    sendOTP(email, otpcode);
    return res.status(200).json({ message: "OK", email: email })
} catch (err) {
    return res.status(404).json({ message: "ERROR", cause: err.message })
}

}
const OtpVerifyForgot = async (req, res) => {
    try {
        const { otp, tempemail } = req.body;
        const newUser = await User.findOne({ email: tempemail })
        console.log(newUser.otp)
        console.log(otp)

        if (newUser.otp === otp.toString()) {
            return res.status(200).json({ message: "OK", id: newUser._id })
        } else {
            let errorMessage = 'Incorrect OTP';
            return res.send({ error: errorMessage });
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { npassword, cpassword, id } = req.body;

        if (npassword !== cpassword) {
            let errorMessage = 'Both password do not match';
            return res.send({ error: errorMessage });
        } else {
            const hashedPassword = await bcrypt.hash(npassword, 10);
            const Update = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })

            if (Update) {
                return res.status(200).json({ message: "OK" })
            }
        }

    } catch (err) {
        console.log(err.message)
        return res.status(404).json({ message: "ERROR", cause: err.message })
    }
}

module.exports = { CreateTest, basic, GetTest, UpdateTest, DeleteTest, UploadQuestion, DeleteQuestion, UpdateQuestion, AddInstruction, AdminLogin, verifyAdmin, AdminLogout, ConductTest, SignUp, OTPverify, ResendOTP, verifyUser, UserLogin, OtpForgot, OtpVerifyForgot, ResetPassword }    