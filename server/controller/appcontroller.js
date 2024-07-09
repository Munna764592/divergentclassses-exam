const Test = require('../model/ttmodal');


const basic = (req, res) => {
    res.send('hello from server')
}

const CreateTest = async (req, res) => {
    try {
        const { papername, course, noofquestions, noofsections, examduration } = req.body;

        const newTest = new Test({
            paper_name: papername,
            course,
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
        const { id, papername, course, noofquestions, noofsections, examduration } = req.body;
        const update = {
            paper_name: papername,
            course,
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



module.exports = { CreateTest, basic, GetTest, UpdateTest, DeleteTest }