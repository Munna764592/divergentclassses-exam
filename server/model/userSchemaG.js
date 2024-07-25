const mongoose = require("mongoose")

const userSchemaG = new mongoose.Schema({

    email: {
        type: String,
    },
    password: {
        type: String
    },
    image: {
        type: String,
    },
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    otp: {
        type: String
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("USER", userSchemaG)