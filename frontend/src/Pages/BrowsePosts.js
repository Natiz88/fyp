import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { url } from "./../Constants/Url";
import Post from "../components/Post";
import LeftSidebar from "../components/LeftSideBar";
import RightSidebar from "../components/RightSideBar";
import { Pagination } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const BrowsePosts = () => {
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  // const [tag,setTag] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const tag = query.get("tag");

  useEffect(() => {
    getQuestions();
  }, [page, tag]);

  const handleChange = (event, value) => {
    setPage(value);
    getQuestions();
    // queryClient.invalidateQueries({ queryKey: ["questions"] });
  };

  const getQuestions = async () => {
    setLoading(true);
    const URL =
      tag === null || ""
        ? `${url}/questions?page=${page}`
        : `${url}/questions?page=${page}&&tag=${tag}`;
    try {
      const response = await axios.get(URL);
      setTotalPages(response?.data.totalPages);
      setQuestions(response?.data?.data?.questions);
    } catch (err) {
      toast("An error occured");
    }
    setLoading(false);
  };

  return (
    <div className="w-full md:w-11/12 m-auto flex justify-between">
      <LeftSidebar />
      {isLoading ? (
        <div className="w-full lg:w-3/6 mt-[120px] lg:mt-[80px] flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full min-h-[300px] lg:w-3/6 mt-[120px] lg:mt-[80px] ">
          {tag !== null && (
            <div className="w-full m-4">
              <p>
                Showing results for:{" "}
                <span className="font-semibold text-lg">{tag}</span>
              </p>
            </div>
          )}
          {questions && questions.length > 0 ? (
            questions.map(
              (question) =>
                !question.question_hidden && (
                  <Post singleQuestion={question} getQuestions={getQuestions} />
                )
            )
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center text-center font-semibold text-md md:text-lg">
              Sorry no posts
            </div>
          )}
          {questions?.length > 0 && (
            <div className="w-full flex justify-center py-2">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      )}
      <RightSidebar />
    </div>
  );
};

export default BrowsePosts;
