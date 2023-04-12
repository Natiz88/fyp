import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "./../Constants/Url";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";

const RightSidebar = () => {
  const [isLoading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    getPopularQuestions();
  }, []);

  const getPopularQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/questions/popularQuestions`);
      console.log("qu", response);
      setQuestions(response?.data?.data?.question);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  console.log("ques", questions);

  return (
    <div className="hidden lg:flex w-1/4 h-full mt-[80px]">
      {isLoading ? (
        <div className="min-h-[200px] w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full mt-4 p-4 mx-2 bg-white rounded-lg">
          <h3 className="font-semibold text-md lg:text-lg py-2">
            Popular Questions
          </h3>
          <ul className="list-none">
            {questions.length > 0 &&
              questions.map((question) => (
                <Link to={`/pageDetails/${question?._id}`}>
                  <div className="cursor-pointer py-2">
                    <p className="text-sm">{question?.question_title}</p>
                  </div>
                </Link>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
