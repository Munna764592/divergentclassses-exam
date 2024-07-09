const express = require("express")
const dotenv = require("dotenv")
const appcontroller = require('../controller/appcontroller')



const routes = express();
dotenv.config();

routes.use(express.urlencoded({ extended: false }));
routes.use(express.json());


routes.post('/createtest', appcontroller.CreateTest)
routes.post('/updatetest', appcontroller.UpdateTest)
routes.post('/deletetest', appcontroller.DeleteTest)

routes.get('/', appcontroller.basic)
routes.get('/gettest', appcontroller.GetTest)


module.exports = routes;