import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LeftSidebar from "./../components/LeftSideBar";
import RightSidebar from "./../components/RightSideBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { url } from "./../Constants/Url";
import { BsCoin } from "react-icons/bs";
import CircularProgress from "@mui/material/CircularProgress";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Link } from "react-router-dom";
import { AiFillGift } from "react-icons/ai";
import { GetDate } from "./../Constants/GetDate";

const RewardsLog = () => {
  const [isLoading, setLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.userDetails);

  const getRewardsLog = async () => {
    try {
      const response = await axios.get(`${url}/rewardLog/${user?._id}`);
      setRewards(response?.data?.data?.Rewards);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRewardsLog();
  }, []);

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
              <LeaderboardIcon className="w-16" sx={{ fontSize: "80px" }} />{" "}
              <p className="text-3xl pl-8 font-bold">Rewards Log</p>
            </div>
          </div>
          <div className="m-4 bg-white rounded-lg">
            {rewards && rewards.length > 0 ? (
              rewards.map((reward, i) => {
                return (
                  <div className="flex items-center justify-between py-2 px-8">
                    <p className="w-1/7 text-grayLight">{reward?.type}</p>
                    <p
                      className={
                        parseInt(rewards?.value) < 0
                          ? `px-2 text-error`
                          : `text-green pl-2 w-1/9 `
                      }
                    >
                      {parseInt(rewards?.value) < 0 ? "-" : "+"}
                      {reward?.value}
                    </p>
                    <p className="w-3/5 ">{reward?.title}</p>
                    <p className="w-1/7">{GetDate(reward?.createdAt)}</p>
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

export default RewardsLog;
