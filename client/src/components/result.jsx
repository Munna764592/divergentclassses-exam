import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
Modal.setAppElement("#root");
import { useAuth } from "../contexts/AuthContext";
import Logo from "../images/DC Dot Logo PNG_edited.png";
import { format, parseISO } from "date-fns";
import analytics from "../images/analytics.png";
import rank from "../images/rank.png";
import { Line, Circle } from "rc-progress";

const Profile = ({ userdata }) => {
  const { logout } = useAuth();
  const [openprodet, setprodet] = useState(false);

  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setprodet(false);
      }
    };
    document.addEventListener("mousedown", handler);
  }, []);

  function showConfirmation() {
    const userConfirmed = confirm("Are you wants to logout");
    if (userConfirmed) {
      logout();
    }
  }

  return (
    <>
      <div className="flex items-center">
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setprodet(!openprodet);
            }}
            className="profile">
            {userdata?.image ? (
              <img src={userdata?.image} alt="img"></img>
            ) : (
              <i className="fa-solid fa-user-tie"></i>
            )}
          </button>
          <div
            ref={menuRef}
            className={openprodet ? "pro-det active" : "pro-det inactive"}>
            <div
              style={{
                backgroundColor: "#f0bd0e",
                padding: "2px 5px",
                borderRadius: "6px",
                color: "white",
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
              }}
              className="text-xs my-1">
              {userdata?.email}
            </div>
            <div className="flex items-center tt1">
              <i className="fa-solid fa-user mr-3"></i>
              <Link>My Profile</Link>
            </div>
            <div className="flex items-center my-4 tt1">
              <i className="fa-solid fa-bag-shopping mr-3"></i>
              <Link>My Purchase</Link>
            </div>
            <div className="flex items-center tt1">
              <i className="fa-solid fa-right-from-bracket mr-3"></i>
              <button
                onClick={() => {
                  showConfirmation();
                }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DateTime = ({ val }) => {
  const dateString = val?.conduct_time;

  let formattedDate, day;
  try {
    const date = parseISO(dateString);
    formattedDate = format(date, "PPpp");
    day = format(date, "EEEE");
  } catch (error) {
    console.error("Invalid date format:", error);
    formattedDate = "Invalid date";
    day = "Unknown day";
  }
  return <div className="ml-1"> {formattedDate}</div>;
};

export default function Result() {
  const { tests, userdata, userlogin, isLoggedIn } = useAuth();
  const navigate = useNavigate();


  return (
    <>
      <div style={{ height: "100vh" }} className="flex">
        <div className="left">
          <a href="https://www.divergentclasses.com/">
            <div className="p-6 ts-th text-xl flex">
              <img
                style={{ height: "25px" }}
                src={Logo}
                alt="img"
                className="mr-1"
              />
              Divergent classes
            </div>
          </a>
          <Link to="/test-series">
            <div className="p-6 mid-txt text-xl gh">
              <i className="fa-solid fa-file-arrow-up mr-2"></i> Tests
            </div>
          </Link>
          <Link to="/analytics">
            <div className="p-6 mid-txt gh text-xl">
              <i className="fa-solid fa-chart-simple mr-1"></i>Analytics
            </div>
          </Link>
        </div>
        <div className="right-ts">
          <div className="flex justify-between items-center kh">
            <h2 className="p-3 text-2xl font-semibold">Result</h2>
            {userlogin ? (
              <Profile userdata={userdata} />
            ) : (
              <Link className="ls-btn" to="/login">
                Login/Signup
              </Link>
            )}
          </div>
          <div style={{ overflowY: "auto", maxHeight: "88vh" }}>
            <div className="tstcd">
              <div className="uft flex justify-between items-center">
                <div className="uplq text-xl ml-1 font-bold text-black">
                  Demo Test : General Aptitude
                </div>
                <div>
                  <select className="attp-slct">
                    <option>Attempt 1</option>
                    <option>Attempt 2</option>
                  </select>
                </div>
              </div>
              <div className="flex text-sm text-gray-600 mb-3">
                <div className="flex items-center mr-2">
                  <i className="fa-solid fa-file-pen mr-1"></i> 9 Questions
                </div>
                <div className="flex items-center mr-2">
                  <i className="fa-solid fa-circle-check mr-1"></i> 15 Marks
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-clock mr-1"></i> 30 Mins
                </div>
              </div>
              <div className="flex text-sm text-gray-600">
                <div className="flex items-center mr-2">
                  <i className="fa-solid fa-calendar-days mr-1"></i> Attempted
                  On: 03 july 2024
                </div>
              </div>
              <div className="flex text-sm text-gray-600 mt-4">
                <div className="flex items-center mr-2">
                  <button className="re-atmbtn">Reattempt</button>
                  <button className="vw-solbtn ml-4">View Solutions</button>
                </div>
              </div>
            </div>
            <div className="text-2xl px-4 py-2 font-semibold">
              Result Summary
            </div>
            <div className="p-3  mt-3 rhhn flex justify-between">
              <div>
                <div className="text-xl font-semibold">RANK</div>
                <div className="mt-14">
                  <span
                    style={{ color: "#5ac9f9" }}
                    className="text-7xl font-semibold">
                    110
                  </span>
                  <span className="text-xl font-bold">/1000 </span>
                </div>
              </div>
              <img style={{ width: "15%" }} src={rank} alt="img" />
            </div>

            <div className="rhhn flex justify-between">
              <div>
                <h1 className="text-xl font-semibold">SCORE</h1>
                <div
                  style={{ color: "#5ac9f9" }}
                  className="mt-10 text-7xl font-semibold">
                  07<span className="text-xl font-bold text-black">/15</span>
                </div>
              </div>
              <img style={{ width: "15%" }} src={analytics} alt="img" />
            </div>
            <div className="prognd">
              <div className="font-semibold">Your Progress</div>
              <div
                style={{ width: "100%" }}
                className="flex items-center justify-between">
                <div className="blnpj">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <i className="fa-solid fa-circle-check mr-1"></i> Correct
                    </span>
                    5/9
                  </div>
                  <Line
                    className="my-2"
                    percent={(5 * 100) / 9}
                    strokeWidth={1}
                    strokeColor="#209bd1"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center ">Marks obtained</span>
                    <div className="text-green-600">+6</div>
                  </div>
                </div>
                <div className="blnpj">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <i className="fa-solid fa-circle-xmark mr-1"></i>Incorrect
                    </span>
                    5/9
                  </div>
                  <Line
                    className="my-2"
                    percent={(5 * 100) / 9}
                    strokeWidth={1}
                    strokeColor="#209bd1"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center ">Marks lost</span>
                    <div className="text-red-600">+6</div>
                  </div>
                </div>
                <div className="blnpj">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <i className="fa-solid fa-forward mr-1"></i> Skipped
                    </span>
                    5/9
                  </div>
                  <Line
                    className="my-2"
                    percent={(5 * 100) / 9}
                    strokeWidth={1}
                    strokeColor="#209bd1"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center ">Marks skipped</span>
                    <div>+6</div>
                  </div>
                </div>
              </div>
              <div
                style={{ width: "100%" }}
                className="flex items-center justify-between">
                <div className="blnpj">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <i className="fa-solid fa-bullseye mr-1"></i> Accuracy
                    </span>
                    5/9
                  </div>
                  <Line
                    className="my-2"
                    percent={(5 * 100) / 9}
                    strokeWidth={1}
                    strokeColor="#209bd1"
                  />
                </div>
                <div className="blnpj">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <i className="fa-solid fa-file-circle-check mr-1"></i>{" "}
                      Completed
                    </span>
                    5/9
                  </div>
                  <Line
                    className="my-2"
                    percent={(5 * 100) / 9}
                    strokeWidth={1}
                    strokeColor="#209bd1"
                  />
                </div>
                <div className="blnpj">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <i className="fa-solid fa-clock mr-1"></i> Time taken
                    </span>
                    5/9
                  </div>
                  <Line
                    className="my-2"
                    percent={(5 * 100) / 9}
                    strokeWidth={1}
                    strokeColor="#209bd1"
                  />
                </div>
              </div>
            </div>
            <div className="secpro">
              <div className="font-semibold">Section Wise Performance</div>
              <div className="p-3 mt-3 bg-white hjg">
                <table>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Score</th>
                      <th>Correct</th>
                      <th>Incorrect</th>
                      <th>Skipped</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>NAT</td>
                      <td>kjb</td>
                      <td>khb</td>
                      <td>hjbhb</td>
                      <td>jnj</td>
                      <td>hb</td>
                    </tr>
                    <tr>
                      <td>MSQ</td>
                      <td>kjb</td>
                      <td>khb</td>
                      <td>hjbhb</td>
                      <td>jnj</td>
                      <td>hb</td>
                    </tr>
                    <tr>
                      <td>MCQ</td>
                      <td>kjb</td>
                      <td>khb</td>
                      <td>hjbhb</td>
                      <td>jnj</td>
                      <td>hb</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
