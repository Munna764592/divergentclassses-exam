import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import IMGINS from "../images/Screenshot 2024-07-10 150836.png";
import { useAuth } from "../contexts/AuthContext";

Modal.setAppElement("#root");

const QuestionNAT = ({
  val,
  handleAnswerChange,
  answers,
  handleAnswerChangeMRN
}) => {
  const { dataclick } = useAuth();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(
      answers.find((ans) => ans.q_id === val._id)
        ? answers.find((ans) => ans.q_id === val._id).ans
        : ""
    );
  }, [answers]);

  // useEffect(()=>{
  //   const answer = answers.find((ans) => ans.q_id === val._id);

  //   if(answer){

  //   }
  // },[])

  useEffect(() => {
    const answer = answers.find((ans) => ans.q_id === val._id);
    if (answer) {
      const updateLocalStorage = (questionId) => {
        const storedData = localStorage.getItem("answers");
        let questionsStatus = storedData ? JSON.parse(storedData) : [];
        const existingEntryIndex = questionsStatus.findIndex(
          (item) => item.q_id === questionId
        );
        if (existingEntryIndex >= 0) {
          questionsStatus[existingEntryIndex].status = "red";
        } else {
          questionsStatus.push({ q_id: questionId, ans: "", status: "red" });
        }
        localStorage.setItem("answers", JSON.stringify(questionsStatus));
        // setTimeout(() => {
        // }, 10);
      };
      updateLocalStorage(val._id);
    }
  }, [val._id]);

  const handleButtonClick = (value) => {
    setInputValue((prev) => prev + value);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleChange = (e) => {};
  return (
    <div>
      {" "}
      <img
        className="px-2"
        style={{ width: "70%" }}
        alt="img"
        src={val?.question}
      />
      <div className="px-14">
        <input
          className="nat-inp my-2"
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled
        />
        <div className="keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "-"].map(
            (number) => (
              <button key={number} onClick={() => handleButtonClick(number)}>
                {number}
              </button>
            )
          )}
          <button onClick={handleClear}>C</button>
          <button onClick={handleBackspace}>Backspace</button>
        </div>
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => {
              handleAnswerChangeMRN(val?._id, inputValue);
            }}
            className="btn-tstnxt mr-3">
            Mark & Review Next
          </button>
          <button className="btn-tstnxt" onClick={handleClear}>
            Clear Response
          </button>
        </div>
        <button
          onClick={() => {
            handleAnswerChange(val?._id, inputValue);
          }}
          style={{ backgroundColor: "#209bd1", color: "white" }}
          className="btn-tstnxt">
          Save & Next <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

const Section1 = ({ setActiveSection, data }) => {
  const { tests, userdata } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    setCurrentSliceIndex(data);
  }, [data]);

  const [currentSliceIndex, setCurrentSliceIndex] = useState("0");
  const questionsPerPage = 1;
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === id)[0]
        .questions.filter((type) => type.selectedType === "NAT").length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(Number(currentSliceIndex) + questionsPerPage);
    } else {
      setTimeout(() => {
        setActiveSection("2");
      }, 20);
    }
  };

  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("answers");
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (answ) => answ.q_id !== questionId
      );
      return [
        ...updatedAnswers,
        {
          q_id: questionId,
          ans: answer,
          status: answer?.trim() !== "" ? "green" : "red"
        }
      ];
    });
    handleNextSlice();
  };

  const handleAnswerChangeMRN = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.filter(
        (answ) => answ.q_id !== questionId
      );
      return [
        ...updatedAnswers,
        {
          q_id: questionId,
          ans: answer,
          status: answer.trim() !== "" ? "purpleT" : "purple"
        }
      ];
    });
    handleNextSlice();
  };

  return (
    <>
      <div
        className="px-2 flex items-center"
        style={{
          fontWeight: "500",
          borderBottom: "1px solid rgb(199, 199, 199)"
        }}>
        <div className="text-sm py-1">
          Question No. {currentSliceIndex + questionsPerPage}
        </div>
      </div>
      <div style={{ height: "55vh", overflowY: "auto" }} className="pb-4">
        {tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <QuestionNAT
                key={index}
                val={val}
                handleAnswerChange={handleAnswerChange}
                handleAnswerChangeMRN={handleAnswerChangeMRN}
                answers={answers}
              />
            );
          })}
      </div>
    </>
  );
};

const Section2 = ({ setActiveSection }) => {
  const { tests } = useAuth();
  const { id } = useParams();

  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);
  const questionsPerPage = 1;
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === id)[0]
        .questions.filter((type) => type.selectedType === "MSQ").length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(currentSliceIndex + questionsPerPage);
    } else {
      setActiveSection("3");
    }
  };

  return (
    <>
      <div
        className="px-2 flex items-center"
        style={{
          fontWeight: "500",
          borderBottom: "1px solid rgb(199, 199, 199)"
        }}>
        <div className="text-sm py-1">
          Question No. {currentSliceIndex + questionsPerPage}
        </div>
      </div>
      <div style={{ height: "55vh", overflowY: "auto" }} className="px-2 pb-2">
        {tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MSQ")
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <div key={index}>
                {" "}
                <img style={{ width: "70%" }} alt="img" src={val?.question} />
                <div className="px-3">
                  <div className="mb-1">
                    <label className="mr-1">
                      <input className="cursor-pointer" type="checkbox" />
                    </label>
                    <span>A</span>
                  </div>
                  <div className="mb-1">
                    <label className="mr-1">
                      <input className="cursor-pointer" type="checkbox" />
                    </label>
                    <span>B</span>
                  </div>
                  <div className="mb-1">
                    <label className="mr-1">
                      <input className="cursor-pointer" type="checkbox" />
                    </label>
                    <span>C</span>
                  </div>
                  <div className="mb-1">
                    <label className="mr-1">
                      <input className="cursor-pointer" type="checkbox" />
                    </label>
                    <span>D</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button className="btn-tstnxt mr-3">Mark & Review Next</button>
          <button className="btn-tstnxt">Clear Response</button>
        </div>
        <button
          onClick={handleNextSlice}
          style={{ backgroundColor: "#209bd1", color: "white" }}
          className="btn-tstnxt">
          Save & Next <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </>
  );
};

const Section3 = ({ setActiveSection }) => {
  const { tests } = useAuth();
  const { id } = useParams();

  const [currentSliceIndex, setCurrentSliceIndex] = useState(0);
  const questionsPerPage = 1;
  const handleNextSlice = () => {
    if (
      currentSliceIndex <
      tests
        ?.filter((item) => item._id === id)[0]
        .questions.filter((type) => type.selectedType === "MCQ").length -
        questionsPerPage
    ) {
      setCurrentSliceIndex(currentSliceIndex + questionsPerPage);
    } else {
      setActiveSection("1");
    }
  };

  return (
    <>
      <div
        className="px-2 flex items-center"
        style={{
          fontWeight: "500",
          borderBottom: "1px solid rgb(199, 199, 199)"
        }}>
        <div className="text-sm py-1">
          Question No. {currentSliceIndex + questionsPerPage}
        </div>
      </div>
      <div style={{ height: "55vh", overflowY: "auto" }} className="px-2">
        {tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MCQ")
          .slice(currentSliceIndex, currentSliceIndex + questionsPerPage)
          .map((val, index) => {
            return (
              <div key={index}>
                {" "}
                <img style={{ width: "70%" }} alt="img" src={val?.question} />
                <div className="px-3 pb-2">
                  <div>
                    <label>
                      <input name="option" type="radio" /> A
                    </label>
                  </div>
                  <div>
                    <label>
                      <input name="option" type="radio" /> B
                    </label>
                  </div>
                  <div>
                    <label>
                      <input name="option" type="radio" /> C
                    </label>
                  </div>
                  <div>
                    <label>
                      <input name="option" type="radio" /> D
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="ts-tstfxd flex items-center justify-between">
        <div className="flex items-center">
          <button className="btn-tstnxt mr-3">Mark & Review Next</button>
          <button className="btn-tstnxt">Clear Response</button>
        </div>
        <button
          onClick={handleNextSlice}
          style={{ backgroundColor: "#209bd1", color: "white" }}
          className="btn-tstnxt">
          Save & Next <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
    </>
  );
};

const ButoonSelect = ({ val, index, onUpdateQuestion }) => {
  const { clickData } = useAuth();
  const [activeStatus, setactiveStatus] = useState("nos2");
  const renderStatus = () => {
    switch (activeStatus) {
      case "red":
        return "nos2";
      case "green":
        return "nos5";
      case "purple":
        return "nos4";
      case "purpleT":
        return "nos3";
      default:
        return "nos";
    }
  };
  useEffect(() => {
    setactiveStatus(
      JSON.parse(localStorage.getItem("answers")).filter(
        (qs) => qs.q_id === val._id
      )[0]?.status
    );
  }, [val]);
  return (
    <>
      <button
        onClick={() => {
          onUpdateQuestion(index);
          clickData(index);
        }}
        className={renderStatus()}>
        {index + 1}
      </button>
    </>
  );
};
export default function TestPaper() {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "75%"
    }
  };

  const { tests, userdata } = useAuth();
  const { id } = useParams();
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const [modalIsOpenQ, setIsOpenQ] = useState(false);
  function openModalQ() {
    setIsOpenQ(true);
  }
  function closeModalQ() {
    setIsOpenQ(false);
  }
  const [sharedData, setSharedData] = useState("");
  const handleUpdateQuestion = (newdata) => {
    setSharedData(newdata);
  };

  const [activeSection, setActiveSection] = useState("1");
  const renderSection = () => {
    switch (activeSection) {
      case "1":
        return (
          <Section1 data={sharedData} setActiveSection={setActiveSection} />
        );
      case "2":
        return <Section2 setActiveSection={setActiveSection} />;
      case "3":
        return <Section3 setActiveSection={setActiveSection} />;
      default:
        return <Section1 setActiveSection={setActiveSection} />;
    }
  };

  const renderSecType = () => {
    switch (activeSection) {
      case "1":
        return "NAT";
      case "2":
        return "MSQ";
      case "3":
        return "MCQ";
      default:
        return "NAT";
    }
  };

  const renderType = () => {
    switch (activeSection) {
      case "1":
        return "Numerical Answer Type";
      case "2":
        return "Multiple Selective Question";
      case "3":
        return "Multiple Choice Question";
      default:
        return "Numerical Answer Type";
    }
  };
  const renderMarks = () => {
    switch (activeSection) {
      case "1":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]?.marks;
      case "2":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MSQ")[0]?.marks;
      case "3":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MCQ")[0]?.marks;
      default:
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]?.marks;
    }
  };
  const renderNegativeMarks = () => {
    switch (activeSection) {
      case "1":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]
          ?.negativemarks;
      case "2":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MSQ")[0]
          ?.negativemarks;
      case "3":
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "MCQ")[0]
          ?.negativemarks;
      default:
        return tests
          ?.filter((item) => item._id === id)[0]
          .questions.filter((type) => type.selectedType === "NAT")[0]
          ?.negativemarks;
    }
  };

  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };

    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("copy", preventDefault);
      img.addEventListener("dragstart", preventDefault);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("copy", preventDefault);
        img.removeEventListener("dragstart", preventDefault);
      });
    };
  }, []);
  return (
    <div className="h-screen">
      <div
        style={{
          borderBottom: "1px solid rgb(198, 198, 198)",
          backgroundColor: "#209bd1",
          color: "white",
          fontWeight: "600"
        }}
        className="px-6 py-2 flex items-center justify-between">
        <div>{tests?.filter((item) => item._id === id)[0].paper_name}</div>
        <div className="flex items-center">
          <div className="mr-3 flex items-center">
            <button className="view-ins" onClick={openModalQ}>
              <i className="fa-solid fa-circle mr-1 text-green-700"></i>Question
              paper
            </button>
          </div>
          <div className="flex items-center">
            <button className="view-ins" onClick={openModal}>
              {" "}
              <i className="fa-solid fa-circle mr-1 text-blue-700"></i>
              View Instructions
            </button>
          </div>
        </div>
      </div>
      <div className="flex">
        <div style={{ width: "80%" }} className="left-ins">
          <div
            style={{
              fontWeight: "500",
              borderBottom: "1px solid rgb(199, 199, 199)"
            }}
            className="flex py-1 px-4 text-sm items-center">
            <button style={{ borderRadius: "4px" }} className="tm-left mr-2">
              PART A
            </button>
            <button style={{ borderRadius: "4px" }} className="tm-left">
              PART B
            </button>
          </div>
          <div
            style={{
              fontWeight: "500",
              borderBottom: "1px solid rgb(199, 199, 199)"
            }}
            className="flex py-1 px-4 justify-between text-sm items-center">
            <span className="tm-left">Sections</span>
            <span className="tm-left">Time Left: 00:29:30</span>
          </div>
          <div
            style={{
              fontWeight: "600",
              color: "#209bd1",
              borderBottom: "1px solid rgb(199, 199, 199)"
            }}
            className="flex text-xs">
            <button
              onClick={() => setActiveSection("1")}
              className={
                activeSection === "1" ? "activesection btn-sec" : "btn-sec"
              }
              style={{ borderRight: "1px solid rgb(199, 199, 199)" }}>
              <span>Section 1 - NAT</span>
            </button>
            <button
              onClick={() => setActiveSection("2")}
              className={
                activeSection === "2" ? "activesection btn-sec" : "btn-sec"
              }
              style={{ borderRight: "1px solid rgb(199, 199, 199)" }}>
              <span>Section 2 - MSQ</span>
            </button>
            <button
              onClick={() => setActiveSection("3")}
              className={
                activeSection === "3" ? "activesection btn-sec" : "btn-sec"
              }
              style={{ borderRight: "1px solid rgb(199, 199, 199)" }}>
              <span>Section 3 - MCQ</span>
            </button>
          </div>
          <div
            className="px-2 flex items-center justify-between"
            style={{
              fontWeight: "500",
              borderBottom: "1px solid rgb(199, 199, 199)"
            }}>
            <div className="text-sm">Question Type: {renderType()}</div>
            <div className="flex items-center py-2">
              <span
                style={{
                  borderRight: "1px solid rgb(199, 199, 199)"
                }}
                className="text-xs px-1">
                Marks for correct answer:{" "}
                <span className="text-green-600">{renderMarks()}</span>{" "}
              </span>
              <span className="ml-1 text-xs">
                Negative Marks:{" "}
                <span className="text-red-600">{renderNegativeMarks()}</span>
              </span>
            </div>
          </div>

          <div>{renderSection()}</div>
        </div>
        <div style={{ width: "20%" }} className="right-ins position-relative">
          <div
            className="flex items-center justify-center text-sm"
            style={{
              borderBottom: "1px solid rgb(198, 198, 198)",
              height: "81px"
            }}>
            {userdata?.email}
          </div>
          <div
            className="p-2"
            style={{
              borderBottom: "1px solid rgb(198, 198, 198)",
              height: "140px"
            }}>
            <div className="text-xs flex justify-between">
              <div className="flex items-center">
                <div
                  style={{ height: "30px", width: "30px" }}
                  className="nos5 clip2 m-1 flex items-center justify-center">
                  5
                </div>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <div
                  style={{ height: "30px", width: "30px" }}
                  className="nos2 clip m-1 flex items-center justify-center">
                  1
                </div>
                <span>Not Answered</span>
              </div>
            </div>
            <div className="text-xs flex justify-between">
              <div className="flex items-center">
                <div
                  style={{ height: "30px", width: "30px" }}
                  className="nos  m-1 flex items-center justify-center">
                  3
                </div>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center">
                <div
                  style={{ height: "30px", width: "30px" }}
                  className="nos4 m-1 flex items-center justify-center">
                  4
                </div>
                <span>Marked for Review</span>
              </div>
            </div>
            <div className="text-xs flex justify-between">
              <div className="flex items-center">
                <div
                  style={{ height: "30px", width: "30px" }}
                  className="nos3  m-1 flex items-center justify-center">
                  7
                </div>
                <span>Answered and Marked for Review</span>
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#209bd1",
              fontWeight: "500",
              color: "white"
            }}
            className="px-2 py-1">
            Section {activeSection} - {renderSecType()}
          </div>
          <div className="p-1 text-center position-relative">
            <div style={{ fontWeight: "500" }} className="text-sm">
              Choose a question
            </div>
            <div style={{ overflowY: "auto", height: "242px" }}>
              {tests
                ?.filter((item) => item._id === id)[0]
                .questions.filter(
                  (type) => type.selectedType === renderSecType()
                )
                ?.map((val, index) => {
                  return (
                    <ButoonSelect
                      onUpdateQuestion={handleUpdateQuestion}
                      val={val}
                      key={index}
                      index={index}
                    />
                  );
                })}
            </div>
          </div>
          <div className="position-absolute sbm-btn bottom-0">
            <button className="btn-submit">Submit</button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Instructions</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModal}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-red-600 my-1 text-center">
          Note that timer is ticking while you read the instructions. Close this
          page to return to answering the questions.
        </div>
        <div className="ovrflow-ins">
          <div style={{ fontWeight: "600" }} className="mt-4 text-center">
            Read the following instructions carefully!
          </div>
          <div className="px-14 py-4 text-sm mb-2">
            <ol style={{ listStyle: "revert" }} type="1">
              <li>Total duration of examination is 120 minutes.</li>
              <li>
                The clock will be set at the server. The countdown timer in the
                top right corner of screen will display the remaining time
                available for you to complete the examination. When the timer
                reaches zero, the examination will end by itself. You will not
                be required to end or submit your examination.
              </li>
              <li>
                The Question Palette displayed on the right side of screen will
                show the status of each question using one of the following
                symbols:
              </li>
              <img alt="img" src={IMGINS} />
              The Marked for Review status for a question simply indicates that
              you would like to look at that question again.
              <li>
                You can click on the {"<"} arrow which appears to the left of
                question palette to collapse the question palette thereby
                maximizing the question window. To view the question palette
                again, you can click on {"<"} which appears on the right side of
                question window.
              </li>
              <li>
                You can click on Scroll Down to navigate to the bottom and
                Scroll Upto navigate to the top of the question area, without
                scrolling.
              </li>
              <h1
                className="my-1"
                style={{ textDecoration: "underline", fontWeight: "700" }}>
                {" "}
                Navigating to a Question:
              </h1>
              <li>
                To answer a question, do the following:
                <ol className="pl-4" style={{ listStyle: "lower-alpha" }}>
                  <li>
                    Click on the question number in the Question Palette at the
                    right of your screen to go to that numbered question
                    directly. Note that using this option does NOT save your
                    answer to the current question.
                  </li>
                  <li>
                    Click on <span className="font-semibold">Save & Next</span>{" "}
                    to save your answer for the current question and then go to
                    the next question.
                  </li>
                  <li>
                    Click on{" "}
                    <span className="font-semibold">
                      Mark for Review & Next
                    </span>{" "}
                    to save your answer for the current question, mark it for
                    review, and then go to the next question.
                  </li>
                </ol>
              </li>
              <h1
                className="my-1"
                style={{ textDecoration: "underline", fontWeight: "700" }}>
                {" "}
                Answering a Question :
              </h1>
              <li>Procedure for answering a multiple choice type question:</li>
              <ol className="pl-4" style={{ listStyle: "lower-alpha" }}>
                <li>
                  To select your answer, click on the button of one of the
                  options
                </li>
                <li>
                  To deselect your chosen answer, click on the button of the
                  chosen option again or click on the Clear Response button
                </li>
                <li>
                  To change your chosen answer, click on the button of another
                  option
                </li>
                <li>
                  To save your answer, you MUST click on the Save & Next button
                </li>
                <li>
                  To mark the question for review, click on the Mark for Review
                  & Next button.
                </li>
              </ol>
              <li>
                To change your answer to a question that has already been
                answered, first select that question for answering and then
                follow the procedure for answering that type of question.
              </li>
              <h1
                className="my-1"
                style={{ textDecoration: "underline", fontWeight: "700" }}>
                {" "}
                Navigating through sections:
              </h1>
              <li>
                Sections in this question paper are displayed on the top bar of
                the screen. Questions in a section can be viewed by clicking on
                the section name. The section you are currently viewing is
                highlighted.
              </li>
              <li>
                After clicking the Save & Next button on the last question for a
                section, you will automatically be taken to the first question
                of the next section.
              </li>
              <li>
                You can shuffle between sections and questions anytime during
                the examination as per your convenience only during the time
                stipulated.
              </li>
              <li>
                Candidate can view the corresponding section summary as part of
                the legend that appears in every section above the question
                palette.
              </li>
            </ol>
          </div>
          <div style={{ fontWeight: "600" }} className="mt-4 text-center">
            Other Important Instructions
          </div>
          <div style={{ fontWeight: "500" }} className="mt-4">
            Instructions specific to this online exam paper
          </div>
          <div className="text-sm">
            {tests
              ?.filter((item) => item._id === id)
              .map((val, index) => {
                return (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: val.marking_scheme_instructions
                    }}></div>
                );
              })}
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpenQ}
        onRequestClose={closeModalQ}
        style={customStyles}
        shouldCloseOnOverlayClick={false}>
        <div className="justify-between flex yth">
          <div>Instructions</div>
          <button
            style={{ color: "black" }}
            className="text-xl"
            onClick={closeModalQ}>
            <i className="fa-regular fa-circle-xmark"></i>
          </button>
        </div>
        <div className="text-red-600 my-1 text-center">
          Note that timer is ticking while you read the questions. Close this
          page to return to answering the questions.
        </div>
        <div className="ovrflow-ins">
          <div style={{ fontWeight: "600" }} className="mt-4 text-center"></div>
          <div className="px-2 py-2 text-sm mb-2">
            <div className="text-xl font-semibold">Section 1 - NAT</div>
            {tests
              ?.filter((item) => item._id === id)[0]
              .questions.filter((type) => type.selectedType === "NAT")
              ?.map((val, index) => {
                return (
                  <div key={index} className="mt-2 p-3 bg-white hjg text-sm">
                    <div className="flex">
                      <div className="mr-1">
                        Q. {index + 1}
                        {")"}
                      </div>
                      <img
                        style={{ width: "95%" }}
                        alt="img"
                        src={val?.question}
                      />
                    </div>
                    <div className="flex items-center mt-4 italic">
                      <div className="mr-2">
                        Question Type:{" "}
                        <span className="font-semibold">
                          {val?.selectedType}
                        </span>
                        {";"}
                      </div>
                      <div className="mr-2">
                        Marks for correct answer:{" "}
                        <span className="font-semibold text-green-600">
                          {val?.marks}
                        </span>
                        {";"}
                      </div>
                      <div>
                        Marks for correct answer:{" "}
                        <span className="font-semibold text-red-600">
                          {val?.negativemarks}
                        </span>
                      </div>
                    </div>
                    <hr className="my-2" />
                  </div>
                );
              })}
            <div className="text-xl font-semibold">Section 2 - MSQ</div>
            {tests
              ?.filter((item) => item._id === id)[0]
              .questions.filter((type) => type.selectedType === "MSQ")
              ?.map((val, index) => {
                return (
                  <div key={index} className="mt-2 p-3 bg-white hjg text-sm">
                    <div className="flex">
                      <div className="mr-1">
                        Q. {index + 1}
                        {")"}
                      </div>
                      <img
                        style={{ width: "95%" }}
                        alt="img"
                        src={val?.question}
                      />
                    </div>
                    <div className="flex items-center mt-4 italic">
                      <div className="mr-2">
                        Question Type:{" "}
                        <span className="font-semibold">
                          {val?.selectedType}
                        </span>
                        {";"}
                      </div>
                      <div className="mr-2">
                        Marks for correct answer:{" "}
                        <span className="font-semibold text-green-600">
                          {val?.marks}
                        </span>
                        {";"}
                      </div>
                      <div>
                        Marks for correct answer:{" "}
                        <span className="font-semibold text-red-600">
                          {val?.negativemarks}
                        </span>
                      </div>
                    </div>
                    <hr className="my-2" />
                  </div>
                );
              })}
            <div className="text-xl font-semibold">Section 3 - MCQ</div>
            {tests
              ?.filter((item) => item._id === id)[0]
              .questions.filter((type) => type.selectedType === "MCQ")
              ?.map((val, index) => {
                return (
                  <div key={index} className="mt-2 p-3 bg-white hjg text-sm">
                    <div className="flex">
                      <div className="mr-1">
                        Q. {index + 1}
                        {")"}
                      </div>
                      <img
                        style={{ width: "95%" }}
                        alt="img"
                        src={val?.question}
                      />
                    </div>
                    <div className="flex items-center mt-4 italic">
                      <div className="mr-2">
                        Question Type:{" "}
                        <span className="font-semibold">
                          {val?.selectedType}
                        </span>
                        {";"}
                      </div>
                      <div className="mr-2">
                        Marks for correct answer:{" "}
                        <span className="font-semibold text-green-600">
                          {val?.marks}
                        </span>
                        {";"}
                      </div>
                      <div>
                        Marks for correct answer:{" "}
                        <span className="font-semibold text-red-600">
                          {val?.negativemarks}
                        </span>
                      </div>
                    </div>
                    <hr className="my-2" />
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
