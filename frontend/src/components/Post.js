import { useState, useEffect, useRef } from "react";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { url, baseURL } from "./../Constants/Url";
import { GetDate } from "./../Constants/GetDate";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { modalActions } from "../Redux/ModalReducer";
import PostOptions from "./PostOptions";
import VerifiedIcon from "@mui/icons-material/Verified";
import useOutsideClick from "../hooks/useOutsideClick";

const Post = ({ singleQuestion, getQuestions }) => {
  const user = useSelector((state) => state.login.userDetails);
  const [height, setHeight] = useState(0);
  const [seeMore, setMore] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [isOptionOpen, setOptionOpen] = useState(false);
  const [question, setQuestion] = useState(singleQuestion);

  const postRef = useRef(null);
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    if (user?._id && question?.question_likes.includes(user._id)) {
      setLiked(true);
    }
    setHeight(postRef.current.clientHeight);
  }, []);

  const handleClickOutside = () => {
    setOptionOpen(false);
  };

  // const useOutsideClick = (callback) => {
  //   const ref = useRef(null);

  //   useEffect(() => {
  //     const handleClick = (event) => {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         callback();
  //       }
  //     };

  //     document.addEventListener("click", handleClick);

  //     return () => {
  //       document.removeEventListener("click", handleClick);
  //     };
  //   }, [ref]);

  //   return ref;
  // };
  const clickRef = useOutsideClick(handleClickOutside);

  const createdAt = GetDate(question?.createdAt);

  const updatequestion = async () => {
    try {
      const response = await axios.get(`${url}/questions/${question?._id}`);
      console.log("ind", response.data.data.question);
      setQuestion(response?.data?.data?.question);
    } catch (err) {
      console.log(err);
    }
  };

  const likePost = async () => {
    if (!loggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${url}/questions/like/${question?._id}`, {}, config);
      updatequestion();
      setLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("hidde", question);
  return (
    <div className="m-4 bg-white rounded-lg tracking-normal z-0 relative">
      <div
        className={`${seeMore ? "" : "max-h-[300px]"} overflow-clip my-4`}
        ref={postRef}
      >
        <div className="w-full h-[80px] bg-white flex items-center rounded-t-lg ">
          <div className="w-full flex items-center justify-between px-8 ">
            <div className="w-3/4 cursor-pointer ">
              <Link to={`/profile/${question?.user_id?._id}`} className="flex">
                <img
                  className="rounded-full w-[40px] h-[40px]"
                  src={
                    question?.user_id &&
                    question?.user_id?.user_image.includes("https://")
                      ? `${question?.user_id?.user_image}`
                      : `${baseURL}/static/users/${question?.user_id?.user_image}`
                  }
                  alt="img"
                />
                <div className="h-full ml-2">
                  <p className="font-semibold text-md">
                    {question?.user_id?.full_name || "John doe"}{" "}
                    {question?.user_id?.user_verified === "true" && (
                      <VerifiedIcon />
                    )}
                  </p>
                  <p className="text-xs">{createdAt}</p>
                </div>
              </Link>
            </div>
            <MoreVert
              onClick={() => setOptionOpen(!isOptionOpen)}
              ref={clickRef}
              className="cursor-pointer"
            />
            <div className="absolute top-14 right-5">
              {isOptionOpen && (
                <PostOptions
                  getQuestions={getQuestions}
                  user={user}
                  question={question}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full mb-8 px-8 cursor-pointer">
          <Link to={`/pageDetails/${question?._id}`}>
            <p className="font-semibold text-lg lg:text-lg">
              {question?.question_title}
            </p>
          </Link>
          {question?.question_body && <br />}
          {question?.question_body && (
            <p className="text" onClick={() => setMore(true)}>
              {question.question_body}
            </p>
          )}
          {question?.question_images.length > 0 && (
            <div className="py-4">
              {question?.question_images.map((image) => (
                <img
                  alt="img"
                  src={`http://localhost:5000/static/questions/${image}`}
                  className="py-4"
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {height === 300 && (
        <span
          className="text-login cursor-pointer pl-8 py-4"
          onClick={() => setMore(!seeMore)}
        >
          {!seeMore ? "show more.." : "show less.."}
        </span>
      )}
      <Link to={`/pageDetails/${question?._id}`}>
        <div className="w-full text-sm flex justify-between px-8 py-2">
          <p className="cursor-pointer hover:underline">
            {question?.question_likes.length} Likes
          </p>
          <div className="cursor-pointer hover:underline flex">
            <p className="pr-2">
              {question?.question_answers && question?.question_answers.length}{" "}
              Answers
            </p>
            <p>
              {question?.question_comments &&
                question?.question_comments.length}{" "}
              Comments
            </p>
          </div>
        </div>
      </Link>
      <div className="w-full h-[50px] bg-white flex justify-around items-center rounded-b-lg border-t border-grayLight text-sm md:text-md">
        <div
          onClick={likePost}
          className="flex items-center w-1/4 h-4/5 justify-center cursor-pointer hover:bg-grayLight"
        >
          {isLiked ? (
            <ThumbUpIcon sx={{ color: "#00aeff" }} />
          ) : (
            <ThumbUpOffAltIcon />
          )}
          <span className="pl-2">Like</span>
        </div>
        <Link
          to={`/pageDetails/${question?._id}`}
          className="flex items-center w-1/4 h-4/5 justify-center cursor-pointer hover:bg-grayLight"
        >
          <CreateOutlinedIcon />
          <span className="pl-2">Answer</span>
        </Link>
        <Link
          to={`/pageDetails/${question?._id}`}
          className="flex items-center w-1/4 h-4/5 justify-center cursor-pointer hover:bg-grayLight"
        >
          <ChatBubbleOutlineIcon />
          <span className="pl-2">Comment</span>
        </Link>
      </div>
    </div>
  );
};

export default Post;
