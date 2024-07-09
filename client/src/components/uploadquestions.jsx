import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useFormik } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "36%"
  }
};
const initialValues = {
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  ans: "",
  questionimg: null
};

export default function UploadQuestions() {
  const { testdetails, tests } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);
  const { id } = useParams();

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const questionSchema = Yup.object({
    questionimg: Yup.mixed().required('Please fill above field'),
    option1: Yup.string().required("Please fill option 1"),
    option2: Yup.string().required("Please fill above field"),
    option3: Yup.string().required("Please fill above field"),
    option4: Yup.string().required("Please fill above field"),
    ans: Yup.string().min(1).max(1).required("Please fill the answer")
  });

  const { values, touched, errors, handleChange, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: questionSchema,
      onSubmit: (values) => {
        // questions(values);
        // closeModal();
        console.log(values);
      }
    });

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile instanceof Blob) {
      try {
        setSelectedImage(URL.createObjectURL(imageFile));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [selectedImage1, setSelectedImage1] = useState(null);
  const handleImageChange1 = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile instanceof Blob) {
      try {
        setSelectedImage1(URL.createObjectURL(imageFile));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="flex main">
        <div className="left">
          <Link to="/uploadtest">
            <div className="p-6 text-xl th">
              <i className="fa-solid fa-file-arrow-up mr-2"></i>Upload Tests
            </div>
          </Link>
          <Link to="/uploadtest">
            <div className="p-6 mid-txt gh text-xl">
              <i className="fa-solid fa-file-pen mr-2"></i>Edit Tests
            </div>
          </Link>
          <Link to="/uploadtest">
            <div className="p-6 last-txt mh text-xl">
              <i className="fa-solid fa-hourglass-start mr-2"></i> Conduct Tests
            </div>
          </Link>
        </div>
        <div className="right">
          <div className="tstcd">
            <div className="uft flex justify-between items-center">
              <div className="uplq text-xl ml-1 font-bold">
                {tests
                  ?.filter((item) => item._id === id)
                  .map((val, index) => {
                    return <div key={index}>{val.paper_name}</div>;
                  })}
              </div>
              <button className="btn-addq" onClick={openModal}>
                <i className="fa-solid fa-plus mr-1"></i>
                Add questions
              </button>
            </div>
            <div>
              <div className="p-3 bg-white hjg">hello</div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Question</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="mt-2">
          <select
            className="form-select form-select-sm"
            aria-label="Small select example">
            <option value="1">Multiple choice questions(MCQ)</option>
            <option value="2">Multiple selective questions(MSQ)</option>
            <option value="3">Numerical answer type(NAT)</option>
          </select>
        </div>
        <form style={{ padding: "20px 0px" }} onSubmit={handleSubmit}>
          <div style={{ width: "100%" }}>
            <label className="qstn-imgdiv" htmlFor="questionUpload">
              Upload question image
            </label>
            <input
              name="questionimg"
              accept="image/*"
              id="questionUpload"
              type="file"
              hidden
              onChange={(e) => {
                setFieldValue("questionimg", e.currentTarget.files[0]);
                handleImageChange(e);
              }}
            />
            <div
              style={
                selectedImage
                  ? {
                      background: `url(${selectedImage}) center/cover`,
                      height: "200px"
                    }
                  : {}
              }></div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="option1">
              <span className="mr-1">
                <i className="fa-solid fa-1 "></i>.
              </span>
              Option 1:-
            </label>
            <div className="flex items-center">
              <input
                style={{ width: "241px" }}
                className={
                  (errors.option1 && touched.option1) || selectedImage1
                    ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                    : "bg-white inpt-pt2 npt w-2/3"
                }
                id="option1"
                name="option1"
                placeholder="Option 1"
                type="text"
                value={values.option1}
                onChange={handleChange}
              />
              <span style={{ margin: "0px 10px" }}>or</span>
              <div>
                <label htmlFor="option1img">
                  <i className="fa-solid fa-file-arrow-up fa-2x"></i>
                </label>
                <input
                  name="option1img"
                  accept="image/*"
                  id="option1img"
                  type="file"
                  hidden
                  onChange={(e) => {
                    setFieldValue("option1img", e.currentTarget.files[0]);
                    handleImageChange1(e);
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={
              selectedImage1
                ? {
                    background: `url(${selectedImage1}) center/cover`,
                    height: "200px"
                  }
                : {}
            }></div>
          {touched.option1 && selectedImage1 ? (
            <div
              style={{ width: "100%" }}
              className="text-red-500 flex items-center justify-center">
              <span>
                <i className="fa-solid fa-triangle-exclamation mr-1"></i>
              </span>{" "}
              <div className="text-sm text-center mt-1">
                Image already uploaded!
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="option2">
              <span className="mr-1">
                <i className="fa-solid fa-2 "></i>.
              </span>
              Option 2:-
            </label>
            <input
              className={
                errors.option2 && touched.option2
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="option2"
              name="option2"
              placeholder="Option 2"
              type="text"
              value={values.option2}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="option3">
              <span className="mr-1">
                <i className="fa-solid fa-3 "></i>.
              </span>
              Option 3:-
            </label>
            <input
              className={
                errors.option3 && touched.option3
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="option3"
              name="option3"
              placeholder="Option 3"
              type="text"
              value={values.option3}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm flex items-center mr-2" htmlFor="option4">
              <span className="mr-1">
                <i className="fa-solid fa-4 "></i>.
              </span>
              Option 4:-
            </label>
            <input
              className={
                errors.option4 && touched.option4
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="option4"
              name="option4"
              placeholder="Option 4"
              type="text"
              value={values.option4}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <label
              className="text-sm flex items-center mr-2 text-green-700"
              htmlFor="ans">
              <i className="fa-solid fa-circle-check mr-1"></i>Answer:-
            </label>
            <input
              className={
                errors.ans && touched.ans
                  ? "bg-ffeeee border-red-500 inpt-pt2 npt w-2/3"
                  : "bg-white inpt-pt2 npt w-2/3"
              }
              id="ans"
              name="ans"
              placeholder="answer"
              type="text"
              value={values.ans}
              onChange={handleChange}
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              style={{ width: "170px" }}
              className="btn-sub">
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
