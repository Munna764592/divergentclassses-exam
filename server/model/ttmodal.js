const mongoose = require('mongoose')

const ttSchema = new mongoose.Schema({
    paper_name: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true
    },
    no_of_questions: {
        type: String,
        required: true
    },
    no_of_sections: {
        type: String,
        required: true,
    },
    exam_duration: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("TESTS", ttSchema)