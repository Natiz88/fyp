import React, { useState, useContext, useEffect, useRef } from "react";
import AnswersDetail from "../components/AnswersDetail";
import CommentDetail from "../components/CommentDetail";
import {
  useParams,
  Link,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { url, baseURL } from "../Constants/Url";
import LeftSidebar from "./../components/LeftSideBar";
import RightSidebar from "../components/RightSideBar";
import { MoreVert } from "@mui/icons-material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { GetDate } from "./../Constants/GetDate";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import { SocketContext } from "./../Socket";
import useOutsideClick from "../hooks/useOutsideClick";

import { TextField, InputAdornment, Button } from "@mui/material";
import PostOptions from "../components/PostOptions";

import AnswerInput from "../components/AnswerInput";
import { toast } from "react-toastify";
import { modalActions } from "../Redux/ModalReducer";

const PageDetails = () => {
  const user = useSelector((state) => state.login.userDetails);
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [isOptionsOpen, setOptions] = useState(false);
  const [images, setImages] = useState([]);
  const [imgPreviews, setImgPreviews] = useState([]);
  const [tab, setTab] = useState("answers");
  const [commentPage, setCommentPage] = useState(10);
  const [answerPage, setAnswerPage] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  const socket = React.useContext(SocketContext);

  const dispatch = useDispatch();

  const handleClickOutside = () => {
    setOptions(false);
  };

  const clickRef = useOutsideClick(handleClickOutside);

  const getQuestion = async () => {
    try {
      const response = await axios.get(`${url}/questions/${id}`);
      return response?.data?.data?.question;
    } catch (err) {
      console.log(err);
    }
  };

  const {
    isLoading,
    isFetching,
    isError,
    data: question,
    status,
  } = useQuery("question", () => getQuestion());

  // const token = localStorage.getItem("token");
  const config = {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const postCommentMutation = useMutation(
    async () => {
      const data = {
        question_id: question?._id,
        comment_body: comment,
      };
      console.log("com", data);
      await axios.post(`${url}/comments`, data, config);
      await socket.emit("send-notification", question?.user_id?._id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("question");
        setComment("");
        toast("Comment posted successfully");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );

  const deleteCommentMutation = useMutation(
    async (data) => {
      await axios.post(`${url}/comments/deleteComment/${data}`, {}, config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("question");
        toast("Comment deleted successfully");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );
  const deleteAnswerMutation = useMutation(
    async (data) => {
      await axios.post(`${url}/answers/deleteAnswer/${data}`, {}, config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("question");
        toast("Answer deleted successfully");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );

  const postAnswerMutation = useMutation(
    async (data) => {
      await axios.post(`${url}/answers`, data, config);
      await socket.emit("send-notification", question?.user_id?._id);
      await socket.emit("send-coins", user?._id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("question");
        toast("Answer posted successfully");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );

  const likePostMutation = useMutation(
    async () => {
      await axios.put(`${url}/questions/like/${question?._id}`, {}, config);
      await socket.emit("send-notification", question?.user_id?._id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("question");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );

  const acceptAnswerMutation = useMutation(
    async (data) => {
      await axios.put(`${url}/answers/acceptAnswer/${data}`, {}, config);
      await socket.emit("send-notification", question?.user_id?._id, user?._id);
    },
    {
      onSuccess: () => {
        toast("The answer was accepted");
        queryClient.invalidateQueries("question");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );
  const upvoteAnswerMutation = useMutation(
    async (data) => {
      await axios.put(`${url}/answers/upvote/${data}`, {}, config);
      await socket.emit("send-notification", question?.user_id?._id);
    },
    {
      onSuccess: () => {
        toast("The answer was upvoted");
        queryClient.invalidateQueries("question");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );
  const downvoteAnswerMutation = useMutation(
    async (data) => {
      await axios.put(`${url}/answers/downvote/${data}`, {}, config);
      await socket.emit("send-notification", question?.user_id?._id);
    },
    {
      onSuccess: () => {
        toast("The answer was downvoted");
        queryClient.invalidateQueries("question");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );
  const replyAnswerMutation = useMutation(
    async (data) => {
      console.log("reply", data);
      await axios.post(`${url}/comments`, data, config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("question");
        toast("The reply was posted");
      },
      onError: () => {
        toast("An error occured");
      },
    }
  );

  const postCommentSubmit = () => {
    if (!isLoggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    postCommentMutation.mutate();
  };
  const deleteCommentSubmit = (data) => {
    deleteCommentMutation.mutate(data);
  };
  const deleteAnswerSubmit = (data) => {
    deleteAnswerMutation.mutate(data);
  };
  const postAnswerSubmit = (data) => {
    if (!isLoggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    postAnswerMutation.mutate(data);
  };
  const likePostSubmit = () => {
    if (!isLoggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    likePostMutation.mutate();
  };
  const acceptAnswerSubmit = (data) => {
    acceptAnswerMutation.mutate(data);
  };
  const upvoteAnswerSubmit = (data) => {
    if (!isLoggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    upvoteAnswerMutation.mutate(data);
  };
  const downvoteAnswerSubmit = (data) => {
    if (!isLoggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    downvoteAnswerMutation.mutate(data);
  };
  const replyAnswerSubmit = (data) => {
    if (!isLoggedIn) {
      dispatch(modalActions.openLoginModal());
      return;
    }
    replyAnswerMutation.mutate(data);
  };

  const showComments = () => {
    setCommentPage(commentPage + 10);
  };

  const showAnswers = () => {
    setAnswerPage(answerPage + 10);
  };

  const isLiked =
    question?.question_likes && question?.question_likes.includes(user?._id);
  const createdAt = GetDate(question?.createdAt);

  const sortOrder = { positive: 0, true: 1, false: 2, pending: 2, negative: 2 };

  return (
    <div className="w-full md:w-11/12 m-auto flex justify-between">
      <LeftSidebar />
      {isLoading ? (
        <div className="w-full lg:w-3/6 mt-[120px] lg:mt-[80px] flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full min-h-[300px] lg:w-3/6 mt-[120px] lg:mt-[80px] ">
          <div className="m-4 bg-white rounded-lg tracking-normal z-0 relative">
            <div className=" my-4">
              <div className="w-full h-[80px] bg-white flex items-center rounded-t-lg">
                <div className="w-full flex items-center justify-between px-8 ">
                  <Link
                    to={`/profile/${
                      question?.user_id?._id || question?.user_id?.id
                    }`}
                    className="w-3/4 cursor-pointer flex"
                  >
                    <img
                      className="rounded-full w-[40px] h-[40px]"
                      src={`${baseURL}/static/users/${question?.user_id?.user_image}`}
                      alt="img"
                    />
                    <div className="h-full ml-2">
                      <p className="font-semibold text-md">
                        {question?.user_id?.full_name || "John doe"}
                      </p>
                      <p className="text-xs">{createdAt}</p>
                    </div>
                  </Link>
                  <MoreVert
                    ref={clickRef}
                    className="cursor-pointer"
                    onClick={() => setOptions(!isOptionsOpen)}
                  />
                  <div className="absolute top-14 right-5">
                    {isOptionsOpen && (
                      <PostOptions user={user} question={question} />
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full mb-2 px-8">
                <p className="font-semibold text-lg lg:text-lg">
                  {question?.question_title}
                </p>
                {question?.question_body && <br />}
                {question?.question_body && (
                  <p className="text">{question.question_body}</p>
                )}
                {question?.question_images.length > 0 && (
                  <div className="py-4 ">
                    {question?.question_images.map((image) => (
                      <img
                        alt="img"
                        src={`${baseURL}/static/questions/${image}`}
                        className="py-4"
                      />
                    ))}
                  </div>
                )}
                <div className="w-full py-2">
                  {question?.question_tags &&
                    question?.question_tags.map((tag) => (
                      <Link to={`/BrowsePosts?tag=${tag}`}>
                        <button
                          className="my-2 px-4 py-2 ml-2 cursor-pointer border border-login text-login rounded-md"
                          title="tag"
                        >
                          {tag}
                        </button>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
            <div className="w-full text-sm flex justify-between px-8 py-2"></div>
            <div className="w-full h-[50px] bg-white flex justify-around items-center rounded-b-lg border-t border-grayLight text-sm md:text-md">
              <div
                onClick={likePostSubmit}
                className="flex cursor-pointer border-grayLight"
              >
                {isLiked ? (
                  <ThumbUpIcon sx={{ color: "#00aeff" }} />
                ) : (
                  <ThumbUpOffAltIcon />
                )}
                <p className="cursor-pointer hover:underline ml-2">
                  {question?.question_likes.length} Likes
                </p>
              </div>
              <div
                onClick={() => setTab("answers")}
                className={`${
                  tab === "answers" ? "border-b-2" : ""
                } flex items-center w-1/4 h-4/5 justify-center cursor-pointer`}
              >
                Answers ({question?.question_answers.length})
              </div>
              <div
                onClick={() => setTab("comments")}
                className={`${
                  tab === "comments" ? "border-b-2" : ""
                } flex items-center w-1/4 h-4/5 justify-center cursor-pointer`}
              >
                Comments ({question?.question_comments.length})
              </div>
            </div>
            {tab === "answers" && (
              <div id="ans">
                <AnswerInput
                  question={question}
                  postAnswerSubmit={postAnswerSubmit}
                />
                {question?.question_answers.length > 0 &&
                  question?.question_answers
                    .sort(
                      (a1, a2) =>
                        sortOrder[a1.answer_accepted] -
                          sortOrder[a2.answer_accepted] ||
                        sortOrder[a1.user_id.user_verified] -
                          sortOrder[a2.user_id.user_verified]
                    )
                    .slice(0, answerPage)

                    .map((answer) => (
                      <div className="w-full bg-white" id={answer._id}>
                        <AnswersDetail
                          singleAnswer={answer}
                          question={question}
                          acceptAnswerSubmit={acceptAnswerSubmit}
                          replyAnswerSubmit={replyAnswerSubmit}
                          upvoteAnswerSubmit={upvoteAnswerSubmit}
                          downvoteAnswerSubmit={downvoteAnswerSubmit}
                          deleteAnswerSubmit={deleteAnswerSubmit}
                        />
                      </div>
                    ))}
                {question?.question_answers.length > 0 &&
                  Math.ceil(question.question_answers.length / answerPage) !==
                    1 && (
                    <div
                      className="text-login pb-4 pl-16 cursor-pointer"
                      onClick={showAnswers}
                    >
                      show more answers (
                      {question.question_answers.length - answerPage})
                    </div>
                  )}
              </div>
            )}

            {tab === "comments" && (
              <div className="py-2">
                <div className="mx-8 my-4">
                  <p className="my-2">Post a Comment: </p>
                  <TextField
                    fullWidth
                    size="small"
                    id="tags"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SendIcon
                            className="cursor-pointer"
                            onClick={postCommentSubmit}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                {question?.question_comments.length > 0 &&
                  question.question_comments
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .slice(0, commentPage)
                    .map((comment) => (
                      <div className="w-full bg-white">
                        <CommentDetail
                          comment={comment}
                          user={user}
                          deleteCommentSubmit={deleteCommentSubmit}
                        />
                      </div>
                    ))}
                {question?.question_comments.length > 0 &&
                  Math.ceil(
                    question?.question_comments.length / commentPage
                  ) !== 1 && (
                    <div
                      className="text-login py-2 pl-8 cursor-pointer"
                      onClick={showComments}
                    >
                      show more comments (
                      {question.question_comments.length - commentPage})
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
      <RightSidebar />
    </div>
  );
};

export default PageDetails;
