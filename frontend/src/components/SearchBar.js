import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { url } from "./../Constants/Url";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [term, setTerm] = useState("");
  const [option, setOption] = useState("Questions");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getQuestions();
    }, 500);

    return () => clearTimeout(timer);
  }, [term]);

  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `${url}/questions/search${option}?term=${term}`
      );
      setQuestions(response?.data?.data?.questions);
    } catch (err) {
      console.log("err", err);
    }
  };
  console.log(`${url}/questions/search${option}?term=${term}`);

  return (
    <div className="w-full h-full lg:h-1/2 p-2 lg:p-0 relative flex items-center">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        type="text"
        className="h-full w-full pl-8 relative rounded-md focus:outline-none"
        placeholder="Search anything..."
      />

      <i className="absolute right-2 text-[15px] md:text-[20px] cursor-pointer">
        <select
          onChange={(e) => {
            setTerm("");
            setOption(e.target.value);
          }}
          className="border-none text-gray outline-none text-base mr-2"
        >
          <option value="Questions">questions</option>
          <option value="Tags">tags</option>
        </select>
      </i>
      {term !== "" && (
        <div className="absolute mt-2 w-full py-4 bg-white rounded-lg pl-4 top-full left-0 shadow-xl">
          {questions.length > 0 &&
            questions.map((question) => (
              <Link
                to={
                  option === "Questions"
                    ? `/pageDetails/${question._id}`
                    : `/BrowsePosts?tag=${question._id}`
                }
              >
                <p
                  onClick={() => setTerm("")}
                  className="text-sm py-2 cursor-pointer"
                >
                  {option === "Questions"
                    ? question.question_title
                    : question._id}
                  {option === "Tags" && (
                    <span className="pl-1">({question.count})</span>
                  )}
                </p>
              </Link>
            ))}
          {questions.length === 0 && (
            <p className="text-center py-8">Sorry no result! </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
