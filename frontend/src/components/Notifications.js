import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AvatarDropdown from "./AvatarDropdown";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { BsCoin } from "react-icons/bs";
import useOutsideClick from "../hooks/useOutsideClick";
import { baseURL } from "./../Constants/Url";

const Notifications = ({
  notifications = [],
  isNotificationsOpen,
  handleNotifications,
  coins = 0,
}) => {
  const [isDropdown, setDropdown] = useState(false);
  const user = useSelector((state) => state.login.userDetails);

  const handleClickOutside = () => {
    handleNotifications(false);
  };
  const handleClickDropdown = () => {
    setDropdown(false);
  };

  const clickRef = useOutsideClick(handleClickDropdown);

  const notificationRef = useOutsideClick(handleClickOutside);

  return (
    <div className="w-full h-full text-[15px] flex items-center justify-around relative z-50">
      <Badge
        badgeContent={notifications.length}
        color="primary"
        ref={notificationRef}
        className="cursor-pointer"
        onClick={() => handleNotifications(!isNotificationsOpen)}
      >
        {notifications > 0 ? (
          <NotificationsActiveIcon sx={{ fontSize: "1.5em", color: "white" }} />
        ) : (
          <NotificationsNoneIcon sx={{ fontSize: "1.5em", color: "white" }} />
        )}
      </Badge>
      <Link to="/leaderboard" className="flex">
        <BsCoin className="text-white text-[25px]" />
        <span className="text-white pl-1 text-base">{coins}</span>
      </Link>
      <div
        className="hidden relative lg:block"
        onClick={() => setDropdown(!isDropdown)}
      >
        <Avatar
          ref={clickRef}
          alt="img"
          src={`${baseURL}/static/users/${user?.user_image}`}
          className="cursor-pointer"
        />
        {isDropdown && <AvatarDropdown />}
      </div>
    </div>
  );
};

export default Notifications;
