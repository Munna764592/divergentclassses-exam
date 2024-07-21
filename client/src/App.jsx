import { Route, Routes } from "react-router-dom";
import "./App.css";
import UploadTest from "./components/uploadtest";
import UploadQuestions from "./components/uploadquestions";
import TestStd from "./components/teststd";
import Instruction from "./components/instruction";
import TestPaper from "./components/testpaper";
import AdminLogin from "./components/adminlogin";
import LoginSignup from "./components/login";
import ResetPassword from "./components/resetpassword";
import Result from "./components/result";
import Analytics from "./components/analytics";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UploadTest />}></Route>
        <Route path="/uploadtest" element={<UploadTest />}></Route>
        <Route path="/adminlogin" element={<AdminLogin />}></Route>
        <Route
          path="/uploadquestions/:id"
          element={<UploadQuestions />}></Route>
        <Route path="/test-series" element={<TestStd />}></Route>
        <Route path="/instructions/:id" element={<Instruction />}></Route>
        <Route path="/testpaper/:id" element={<TestPaper />}></Route>
        <Route path="/login" element={<LoginSignup />}></Route>
        <Route path="/reset-password/:id" element={<ResetPassword />}></Route>
        <Route path="/result" element={<Result />}></Route>
        <Route path="/analytics" element={<Analytics />}></Route>
      </Routes>
    </>
  );
}

export default App;
