import { createContext, useContext, useEffect, useState } from "react";
import {
  CreateTest,
  GetTest,
  UpdateTest,
  deleteTestDetail,
  UploadQuestion,
  deleteQuestion,
  UpdateQuestion,
  AddInstruction,
  Adminlogin,
  checkAuthStatus,
  AdminLogout,
  ConductTest,
  getUser,
  UserLogout,
  LoginWithGoogle,
  SignUp,
  OTPverify,
  checkUserLogin,
  ResendOtp,
  loginUser,
  otpForgot,
  OTPverifyforgot,
  ResetPassword
} from "../helpers/api-communication";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tests, setTests] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorl, setErrorl] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userdata, setUserdata] = useState({});
  const [userlogin, setuserlogin] = useState(false);
  const [errorS, setErrorS] = useState(null);
  const [errorO, setErrorO] = useState(null);
  const [otpfield, setotpfield] = useState(false);
  const [tempemail, settempemail] = useState(null);
  const [otpResend, setOtpResend] = useState(null);
  const [errorL, setErrorL] = useState(null);
  const [ErrorReset, setErrorReset] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      const data = await checkAuthStatus();
      if (data) {
        setAdmin({
          username: data.username,
          id: data.id
        });
        setIsLoggedIn(true);
      }
    }
    checkStatus();

    async function checkUserStatus() {
      const data = await checkUserLogin();
      if (data) {
        setUserdata({
          email: data.email,
          id: data.id
        });
        setuserlogin(true);
      }
    }
    checkUserStatus();

    async function getUserData() {
      const data = await getUser();
      if (data) {
        setUserdata(data.user);
        setuserlogin(true);
      }
    }
    getUserData();
  }, []);

  useEffect(() => {
    async function Gettest() {
      const data = await GetTest();
      if (data) {
        setTests(data);
      }
    }
    Gettest();
  }, []);

  const testdetails = async ({
    papername,
    course,
    totalmarks,
    noofquestions,
    noofsections,
    examduration
  }) => {
    await CreateTest(
      papername,
      course,
      totalmarks,
      noofquestions,
      noofsections,
      examduration
    );
  };

  const UpdateTestDetail = async ({
    papername,
    course,
    totalmarks,
    noofquestions,
    noofsections,
    examduration,
    id
  }) => {
    await UpdateTest(
      papername,
      course,
      totalmarks,
      noofquestions,
      noofsections,
      examduration,
      id
    );
  };

  const deleteTest = async (id) => {
    await deleteTestDetail(id);
  };

  const questions = async ({
    ans,
    id,
    questionimg,
    selectedType,
    marks,
    negativemarks
  }) => {
    await UploadQuestion(
      selectedType,
      ans,
      id,
      questionimg,
      marks,
      negativemarks
    );
  };
  const deletequestion = async (questionid, id) => {
    await deleteQuestion(questionid, id);
  };

  const Updatequestions = async ({
    ans,
    id,
    questionimg,
    selectedType,
    questionID,
    marks,
    negativemarks
  }) => {
    await UpdateQuestion(
      ans,
      id,
      questionimg,
      selectedType,
      questionID,
      marks,
      negativemarks
    );
  };

  const addinstructions = async ({ instructions, id }) => {
    await AddInstruction(instructions, id);
  };

  const adminlogin = async ({ username, password }) => {
    const res = await Adminlogin(username, password);
    if (res.error) {
      setErrorl(res.error);
    } else {
      setIsLoggedIn(true);
      window.location.href = "/uploadtest";
    }
  };

  const Adminlogout = async () => {
    const res = await AdminLogout();
    if (res) {
      window.location.href = "/adminlogin";
    }
  };

  const Conducttest = async (id) => {
    const res = await ConductTest(id);
  };

  const logout = async () => {
    const res = await UserLogout();
    if (res) {
      window.location.href = "/login";
    }
  };

  const loginwithgoogle = async () => {
    await LoginWithGoogle();
  };

  const signup = async ({ email, password }) => {
    const res = await SignUp(email, password);
    if (res.error) {
      setErrorS(res.error);
    } else {
      settempemail(res.email);
      setotpfield(true);
    }
  };

  const verifyOTP = async ({ otp, tempemail }) => {
    const res = await OTPverify(otp, tempemail);
    if (res.error) {
      setErrorO(res.error);
    } else {
      setuserlogin(true);
      window.location.href = "/test-series";
    }
  };

  const ResendOTPs = async (tempemail) => {
    const res = await ResendOtp(tempemail);
    if (res) {
      setOtpResend(res.resend);
    }
  };

  const LoginUser = async ({ email, password }) => {
    const res = await loginUser(email, password);
    if (res.error) {
      setErrorL(res.error);
    } else {
      setuserlogin(true);
      window.location.href = "/test-series";
    }
  };

  const OTPForgot = async (email) => {
    const res = await otpForgot(email);
    if (res) {
      settempemail(res.email);
    }
  };
  const verifyOTPforgot = async ({ otp, tempemail }) => {
    const res = await OTPverifyforgot(otp, tempemail);
    if (res.error) {
      setErrorO(res.error);
    } else {
      window.location.href = `/reset-password/${res.id}`;
    }
  };

  const ResetPass = async ({ npassword, cpassword, id }) => {
    const res = await ResetPassword(npassword, cpassword, id);
    if (res.error) {
      setErrorReset(res.error);
    } else {
      window.location.href = `/login`;
    }
  };

  const [dataclick, setdataclick] = useState();
  const clickData = (data) => {
    setdataclick(data);
  };

  return (
    <AuthContext.Provider
      value={{
        testdetails,
        dataclick,
        tests,
        UpdateTestDetail,
        deleteTest,
        questions,
        deletequestion,
        Updatequestions,
        addinstructions,
        adminlogin,
        isLoggedIn,
        errorl,
        admin,
        Adminlogout,
        Conducttest,
        userdata,
        logout,
        userlogin,
        loginwithgoogle,
        signup,
        otpfield,
        errorS,
        verifyOTP,
        errorO,
        tempemail,
        ResendOTPs,
        otpResend,
        LoginUser,
        errorL,
        OTPForgot,
        verifyOTPforgot,
        ResetPass,
        ErrorReset,
        clickData
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
