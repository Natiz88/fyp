import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LeftSidebar from "./../components/LeftSideBar";
import RightSidebar from "./../components/RightSideBar";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { url, baseURL } from "./../Constants/Url";
import { GetDate } from "../Constants/GetDate";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import Post from "./../components/Post";
import { modalActions } from "../Redux/ModalReducer";
import ProfileEdit from "./../components/ProfileEdit";
import { Dialog } from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import VerifiedIcon from "@mui/icons-material/Verified";
import { loginActions } from "../Redux/LoginReducer";
import AvatarImage from "./../Images/avatar.png";

const Profile = () => {
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams();
  const [tab, setTab] = useState("about");
  const [userProfile, setUserProfile] = useState();
  const dispatch = useDispatch();
  const [hidden_questions, setHiddenQuestions] = useState([]);

  const user = useSelector((state) => state.login.userDetails);
  const isEditProfileModalOpen = useSelector(
    (state) => state.modal.isEditProfileModalOpen
  );

  useEffect(() => {
    getUser();
  }, [id]);

  const getUser = async () => {
    setLoading(true);
    const response = await axios.get(`${url}/users/${id}`);
    const response2 = await axios.get(`${url}/questions/hiddenQuestions/${id}`);
    setHiddenQuestions(response2?.data?.data?.questions);
    setUserProfile(response?.data?.data?.user);
    if (response?.data?.data?.user?._id === user?._id) {
      dispatch(loginActions.updateUser(response?.data?.data?.user));
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
        <div className="w-full lg:w-3/6 mt-[120px] lg:mt-[80px] relative z-0">
          {id === user?._id && (
            <div
              title="update profile"
              onClick={() => dispatch(modalActions.openEditProfileModal())}
              className="absolute cursor-pointer top-8 right-8 border border-black rounded-md p-2"
            >
              <EditIcon />
            </div>
          )}
          {/* {id === user?._id && user.user_verified === "negative" && (
            <div
              title="verify kyc"
              onClick={() => dispatch(modalActions.openTeacherModal())}
              className="absolute cursor-pointer top-24 right-8 border border-black rounded-md p-2"
            >
              <HowToRegIcon />
            </div>
          )}
          {id === user?._id && user.user_verified === "pending" && (
            <div
              title="verificaion pending"
              className="absolute cursor-pointer top-24 right-8 border border-black rounded-md p-2"
            >
              <HourglassBottomIcon />
            </div>
          )} */}
          <div className="m-4 bg-white rounded-lg">
            <div className="flex items-center justify-center py-4">
              <div className="rounded-full w-[120px] h-[120px] relative">
                <img
                  src={userProfile && userProfile?.avatar}
                  // {
                  //   userProfile?.user_image &&
                  //   userProfile?.user_image.includes("https://")
                  //     ? `${userProfile?.user_image}`
                  //     : `${baseURL}/static/users/${userProfile?.user_image}`
                  // }
                  alt="profile"
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <p className="font-semibold lg:font-bold text-md md:text-lg">
                {userProfile?.full_name || "John Doe"}{" "}
                {userProfile?.user_verified === "positive" && <VerifiedIcon />}
              </p>
              <span className="font-semibold">
                {/* Joined: <span>{GetDate(userProfile.createdAt)}</span> */}
              </span>
            </div>
            <div className="w-full flex justify-around items-center pt-8 font-semibold text-lg">
              <p
                onClick={() => setTab("about")}
                className={`${
                  tab === "about" ? "border-b-2" : ""
                } cursor-pointer`}
              >
                About
              </p>
              <p
                onClick={() => setTab("questions")}
                className={`${
                  tab === "questions" ? "border-b-2" : ""
                } cursor-pointer`}
              >
                Questions
              </p>
              <p
                onClick={() => setTab("answers")}
                className={`${
                  tab === "answers" ? "border-b-2" : ""
                } cursor-pointer`}
              >
                Answers
              </p>
              {user && user._id === userProfile?._id && (
                <p
                  onClick={() => setTab("hidden_questions")}
                  className={`${
                    tab === "hidden_questions" ? "border-b-2" : ""
                  } cursor-pointer`}
                >
                  Hidden Posts
                </p>
              )}
            </div>
          </div>
          {tab === "questions" &&
            (userProfile?.questionsAsked.length > 0 ? (
              userProfile.questionsAsked.map((question) => (
                <Post singleQuestion={question} />
              ))
            ) : (
              <div className="m-4 p-8 bg-white flex items-center justify-center rounded-lg">
                No questions Asked
              </div>
            ))}
          {tab === "hidden_questions" &&
            (hidden_questions.length > 0 ? (
              hidden_questions.map((question) => (
                <Post singleQuestion={question} />
              ))
            ) : (
              <div className="m-4 p-8 bg-white flex items-center justify-center rounded-lg">
                No questions hidden
              </div>
            ))}
          {tab === "answers" &&
            (userProfile?.questionsAnswered.length > 0 ? (
              userProfile.questionsAnswered.map((answer) => (
                <div className="m-4 bg-white rounded-lg tracking-normal z-0 relative">
                  <Link to={`/pageDetails/${answer.question_id._id}`}>
                    <div className="w-full mb-4 px-8 cursor-pointer py-4">
                      <p className="font-semibold text-base">
                        Q. {answer?.question_id?.question_title}
                      </p>
                      <p className="py-4">A. {answer?.answer_body}</p>
                    </div>
                  </Link>{" "}
                </div>
              ))
            ) : (
              <div className="m-4 p-8 bg-white flex items-center justify-center rounded-lg">
                No Answers{" "}
              </div>
            ))}
          {tab === "about" && (
            <div className="bg-white m-4 rounded-lg py-8 px-16">
              {userProfile?.bio && (
                <p className="py-4 text-lg">{userProfile?.bio}</p>
              )}
              <p>
                <span className="font-semibold text-base py-2">
                  Joined on :{" "}
                </span>
                {GetDate(userProfile?.createdAt)}
              </p>
              {userProfile?.address && (
                <p>
                  <span className="font-semibold text-base py-2">
                    Lives in :{" "}
                  </span>
                  {userProfile?.address}
                </p>
              )}
              <p>
                <span className="font-semibold text-base py-2">Coins : </span>{" "}
                {userProfile?.coins || 0}
              </p>
              <p>
                <span className="font-semibold text-base py-2">
                  Total questions asked :{" "}
                </span>{" "}
                {userProfile?.questionsAsked.length || 0}
              </p>
              <p>
                <span className="font-semibold text-base py-2">
                  Total answered :{" "}
                </span>{" "}
                {userProfile?.questionsAnswered.length || 0}
              </p>
            </div>
          )}
        </div>
      )}
      <RightSidebar />
      <Dialog
        open={isEditProfileModalOpen}
        onClose={() => dispatch(modalActions.closeEditProfileModal())}
      >
        <ProfileEdit userProfile={userProfile} getUser={getUser} />
      </Dialog>
    </div>
  );
};

export default Profile;
