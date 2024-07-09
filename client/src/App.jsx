import { Route, Routes } from "react-router-dom";
import "./App.css";
import UploadTest from "./components/uploadtest";
import UploadQuestions from "./components/uploadquestions";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UploadTest />}></Route>
        <Route path="/uploadtest" element={<UploadTest />}></Route>
        <Route path="/uploadquestions/:id" element={<UploadQuestions />}></Route>
      </Routes>
    </>
  );
}

export default App;
