import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LeftSidebar from "./../components/LeftSideBar";
import RightSidebar from "./../components/RightSideBar";
import axios from "axios";
import { url } from "./../Constants/Url";
import { BsCoin } from "react-icons/bs";
import CircularProgress from "@mui/material/CircularProgress";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Link } from "react-router-dom";
import { AiFillGift } from "react-icons/ai";
import HistoryIcon from "@mui/icons-material/History";

const LeaderBoard = () => {
  const [isLoading, setLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [tab, setTab] = useState("about");
  const dispatch = useDispatch();

  const getRewards = async () => {
    try {
      const response = await axios.get(`${url}/users/rewards`);
      console.log("reward", response.data.rewards);
      setRewards(response?.data?.rewards);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRewards();
  }, []);

  console.log("length", rewards.length);

  return (
    <div className="w-full md:w-11/12 m-auto flex justify-between">
      <LeftSidebar />
      {isLoading ? (
        <div className="w-full lg:w-3/6 mt-[120px] lg:mt-[80px] flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full lg:w-3/6 mt-[120px] lg:mt-[80px] relative z-0">
          <div className="m-4 bg-white rounded-lg">
            <div className="flex items-center px-16 py-8 bg-lightBlue rounded-md text-white">
              <div className="absolute cursor-pointer top-8 right-8 flex flex-col">
                <Link
                  to="/exchangegift/-1"
                  title="exchange gifts"
                  className="border border-black rounded-md p-1"
                >
                  <AiFillGift className="text-error w-8 h-8" />
                </Link>
                <Link
                  to="/rewardsLog"
                  title="rewards log"
                  className=" border border-black rounded-md p-1 mt-2 flex items-center justify-center"
                >
                  <HistoryIcon className="w-8 h-8" />
                </Link>
              </div>
              <LeaderboardIcon className="w-16" sx={{ fontSize: "80px" }} />{" "}
              <p className="text-3xl pl-8 font-bold">LeaderBoard</p>
            </div>
          </div>
          <div className="m-4 bg-white rounded-lg">
            {rewards.length > 0 ? (
              rewards.map((reward, i) => {
                return (
                  <div className="flex items-center py-2 px-8">
                    <p className="w-1/6">{i + 1}</p>
                    <Link
                      to={`/profile/${reward._id}`}
                      className="flex items-center w-4/6 cursor-pointer"
                    >
                      {" "}
                      <img
                        src={`http://localhost:5000/static/users/${reward.user_image}`}
                        alt="avatar"
                        className="rounded-full w-12"
                      />
                      <p className="pl-4">{reward.full_name}</p>
                    </Link>

                    <div className="w-1/6 flex items-center">
                      <BsCoin />
                      <p className="pl-2">{reward.coins}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No data found</p>
            )}
          </div>
        </div>
      )}
      <RightSidebar />
    </div>
  );
};

export default LeaderBoard;
