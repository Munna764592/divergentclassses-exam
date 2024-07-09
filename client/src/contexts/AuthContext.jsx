import { createContext, useContext, useEffect, useState } from "react";
import {
  CreateTest,
  GetTest,
  UpdateTest,
  deleteTestDetail
} from "../helpers/api-communication";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [tests, setTests] = useState(null);

  useEffect(() => {
    async function Gettest() {
      const data = await GetTest();
      if (data) {
        setTests(data);
      }
    }
    Gettest();
  }, [tests]);

  const testdetails = async ({
    papername,
    course,
    noofquestions,
    noofsections,
    examduration
  }) => {
    await CreateTest(
      papername,
      course,
      noofquestions,
      noofsections,
      examduration
    );
  };

  const UpdateTestDetail = async ({
    papername,
    course,
    noofquestions,
    noofsections,
    examduration,
    id
  }) => {
    await UpdateTest(
      papername,
      course,
      noofquestions,
      noofsections,
      examduration,
      id
    );
  };

  const deleteTest = async (id) => {
    await deleteTestDetail(id);
  };

  return (
    <AuthContext.Provider
      value={{ testdetails, tests, UpdateTestDetail, deleteTest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
