import axios from "axios";

export const CreateTest = async (
  papername,
  course,
  noofquestions,
  noofsections,
  examduration
) => {
  try {
    const res = await axios.post("/createtest", {
      papername,
      course,
      noofquestions,
      noofsections,
      examduration
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const GetTest = async()=>{
    try{
    const res = await axios.get("/gettest");
    return res.data;

    }catch(err){
        console.log(err);
    }
}

export const UpdateTest = async (
  papername,
  course,
  noofquestions,
  noofsections,
  examduration,id
) => {
  try {
    const res = await axios.post("/updatetest", {
      papername,
      course,
      noofquestions,
      noofsections,
      examduration,id
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteTestDetail =  async(id)=>{
    try {
         const res = await axios.post("/deletetest", {
          id
         });
         return res.data;
    } catch (error) {
      console.log(error.message);
    }
}