import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { url, baseURL } from "./../Constants/Url";
import axios from "axios";
import { Link } from "react-router-dom";
import { GetDate } from "./../Constants/GetDate";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import { TextField, InputAdornment } from "@mui/material";
import CommentDetail from "./CommentDetail";
import { MoreVert } from "@mui/icons-material";
import VerifiedIcon from "@mui/icons-material/Verified";
import DoneOutlineSharpIcon from "@mui/icons-material/DoneOutlineSharp";
import FlagSharpIcon from "@mui/icons-material/FlagSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { Dialog } from "@mui/material";
import { screenActions } from "../Redux/ScreenReducer";
import AnswerInput from "./AnswerInput";
import Button from "@mui/material/Button";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import Avatar from "./../Images/avatar.png";

const AnswersDetail = ({
  singleAnswer,
  deleteAnswerSubmit,
  acceptAnswerSubmit,
  upvoteAnswerSubmit,
  downvoteAnswerSubmit,
  replyAnswerSubmit,
  editAnswerSubmit,
  question,
}) => {
  const user = useSelector((state) => state.login.userDetails);

  const [comment, setComment] = useState("");
  const [isEditAnswerOpen, setEditAnswerOpen] = useState(false);
  const [showAnswerComments, setShowAnswerComments] = useState(false);
  const [answer, setAnswer] = useState(singleAnswer);
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const createdAt = GetDate(answer?.createdAt);
  const [imagePreview, setImagePreview] = useState(false);

  useEffect(() => {
    setAnswer(singleAnswer);
    if (
      answer.user_id.user_image &&
      answer.user_id.user_image.includes("https")
    ) {
      setImagePreview(answer?.user_id?.user_image);
    } else if (answer.user_id.user_image) {
      setImagePreview(`${baseURL}/static/users/${answer?.user_id?.user_image}`);
    } else {
      setImagePreview(Avatar);
    }
  }, [acceptAnswerSubmit, replyAnswerSubmit]);

  const postComment = async () => {
    setCommentOpen(false);
    const data = {
      answer_id: singleAnswer?._id,
      comment_body: comment,
    };
    setComment("");
    replyAnswerSubmit(data);
  };

  const isUpvoted = singleAnswer?.upvotes.includes(user?._id);
  const isDownvoted = singleAnswer?.downvotes.includes(user?._id);

  const submitDeletion = () => {
    setOpen(false);
    deleteAnswerSubmit(singleAnswer?._id);
  };

  const reportAnswer = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
          contentType: "multipart/form-data",
        },
      };
      axios.put(`${url}/answers/reportAnswer/${singleAnswer?._id}`, {}, config);
      toast("Answer reported successfully");
    } catch (err) {
      toast("An error occured");
    }
  };

  const acceptAnswer = () => {
    acceptAnswerSubmit(singleAnswer?._id);
  };

  const upvoteAnswer = () => {
    upvoteAnswerSubmit(singleAnswer?._id);
  };

  const downvoteAnswer = () => {
    downvoteAnswerSubmit(singleAnswer?._id);
  };
  const closeAnswerDialog = () => {
    setEditAnswerOpen(false);
  };

  return (
    <div className="w-full flex px-8 overflow-hidden py-4 my-4">
      <div className="w-1/12 flex flex-col items-center pt-2 pr-4">
        <div onClick={upvoteAnswer} className="cursor-pointer">
          <AiFillCaretUp
            className={isUpvoted ? `text-login text-3xl` : `text-3xl`}
          />
        </div>
        <p>{answer?.upvotes.length - answer?.downvotes.length}</p>
        {answer?.answer_accepted && (
          <DoneOutlineSharpIcon sx={{ color: "green" }} />
        )}
        <div onClick={downvoteAnswer} className="cursor-pointer">
          <AiFillCaretDown
            className={isDownvoted ? `text-error text-3xl` : `text-3xl`}
          />
        </div>
      </div>
      <div className="flex flex-col w-11/12">
        <div className="w-full">
          <Link
            to={`/profile/${answer?.user_id?._id}`}
            className="flex cursor-pointer"
          >
            <img
              className="rounded-full w-[30px] h-[30px]"
              // src={
              //   answer && answer?.user_id?.user_image.includes("https://")
              //     ? `${answer?.user_id?.user_image}`
              //     : `${baseURL}/static/users/${answer?.user_id?.user_image}`
              // }
              src={answer?.user_id?.avatar}
              alt="img"
            />
            <div className="h-full ml-2 flex justify-between items-center">
              <p className="font-normal text-md">
                {answer.user_id.full_name || "John Doe"}{" "}
                {answer?.user_id?.user_verified === "positive" && (
                  <VerifiedIcon />
                )}
              </p>

              <p className="text-xs ml-1">{createdAt}</p>
            </div>
          </Link>
          <p className="py-2 pl-8">{answer.answer_body}</p>
          {answer.answer_image.length > 0 &&
            answer.answer_image.map((image) => (
              <img alt="answer" className="py-2" src={answer?.answer_image} />
            ))}

          <div className="flex w-full justify-between my-2 pl-8 text-sm text-grayDark">
            <div className="flex ">
              <CommentIcon className="cursor-pointer" />{" "}
              {answer?.answer_comments && answer?.answer_comments.length}
            </div>
            <p
              className="cursor-pointer"
              onClick={() => setCommentOpen(!isCommentOpen)}
            >
              <ReplyIcon /> Reply
            </p>
            {user && user?._id !== answer?.user_id?._id && (
              <p className="cursor-pointer" onClick={reportAnswer}>
                <FlagSharpIcon /> Report
              </p>
            )}
            {user &&
              user?._id === question?.user_id?._id &&
              answer.answer_accepted && (
                <p className="cursor-pointer" onClick={acceptAnswer}>
                  <ClearIcon /> Cancel
                </p>
              )}
            {user &&
              user?._id === question?.user_id?._id &&
              !answer.answer_accepted && (
                <p className="cursor-pointer" onClick={acceptAnswer}>
                  <CheckIcon /> Accept
                </p>
              )}
            {user && user?._id === answer?.user_id?._id && (
              <p
                className="cursor-pointer"
                onClick={() => setEditAnswerOpen(true)}
              >
                <EditIcon /> Edit
              </p>
            )}
            {user && user?._id === answer?.user_id?._id && (
              <p className="cursor-pointer" onClick={() => setOpen(true)}>
                <DeleteIcon /> Delete
              </p>
            )}
          </div>
          {isCommentOpen && (
            <div className="ml-8 h-[30px]">
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
                        onClick={postComment}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}
          {answer?.answer_comments.length > 0 && (
            <p
              className="pl-8 text-login py-2 cursor-pointer"
              onClick={() => setShowAnswerComments(!showAnswerComments)}
            >
              {showAnswerComments ? "hide " : "show "} comments(
              {answer.answer_comments.length})
            </p>
          )}
        </div>
        {showAnswerComments &&
          answer?.answer_comments.map((comment) => (
            <CommentDetail comment={comment} user={user} />
          ))}
      </div>
      <Dialog
        paperFullWidth
        open={isEditAnswerOpen}
        onClose={() => setEditAnswerOpen(false)}
      >
        <div className="lg:w-[600px] p-2">
          <h1 className="font-bold py-2 pl-2 md:text-lg">Edit your answer</h1>
          <AnswerInput
            body={answer?.answer_body}
            editMode={true}
            answer_id={answer?._id}
            img={answer?.answer_image}
            closeAnswerDialog={closeAnswerDialog}
          />
        </div>
      </Dialog>{" "}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="p-8 py-4">
          <div className="text-lg py-4">
            Are you sure you want to delete this answer?
          </div>
          <div className="flex justify-end items-center">
            <Button onClick={() => setOpen(false)}>no</Button>
            <Button className="ml-4" onClick={submitDeletion}>
              yes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AnswersDetail;
