import React from "react";
import { GoVerified } from "react-icons/go";

const UserDetails = ({ user }) => {
  console.log("ver", user.user_verified);
  return (
    <div className="flex flex-col items-center">
      <div className="w-[80px] bg-red-400 h-[80px] rounded-full">
        <img alt="avatar" className="w-full h-full" src={user?.avatar} />
      </div>
      <p className="flex py-1 items-center">
        <span className="font-semibold pr-2 text-lg">Name: </span>
        <span className="text-lg">{user.full_name}</span>
      </p>
      <p className="flex py-1 items-center text-lg">
        <span className="flex font-semibold pr-2 text-lg">Role: </span>
        <span>{user.user_role}</span>
      </p>
      {user?.user_verified === "positive" && (
        <>
          <p className="flex py-1 items-center text-lg">
            <span className="flex font-semibold pr-2 text-lg">
              Qualification:{" "}
            </span>
            <span>{user.qualification}</span>
          </p>
          <p className="flex py-1 items-center text-lg">
            <span className="flex font-semibold pr-2 text-lg">
              Experience:{" "}
            </span>
            <span>{user.experience}</span>
          </p>
          <p className="flex py-1 items-center text-lg">
            <span className="flex font-semibold pr-2 text-lg">Id Card: </span>
            <img
              at="idcard"
              src={`http://localhost:5000/static/users/${user.id_photo}`}
            />
          </p>
        </>
      )}
      <p className="flex py-1 items-center text-lg">
        <span className="flex font-semibold pr-2 text-lg">Joined: </span>
        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
      </p>
      <p className="flex py-1 items-center text-lg">
        <span className="flex font-semibold pr-2 text-lg">Last Reset: </span>
        <span>{new Date(user.last_reset_time).toLocaleDateString()}</span>
      </p>
      <p className="flex py-1 items-center text-lg">
        <span className="flex font-semibold pr-2 text-lg">Email: </span>
        <span>{user.email}</span>
      </p>
      {user?.address && (
        <p className="flex py-1 items-center text-lg">
          <span className="flex font-semibold pr-2 text-lg">Address: </span>
          <span>{user.address}</span>
        </p>
      )}
      {user?.phone_number && (
        <p className="flex py-1 items-center text-lg">
          <span className="flex font-semibold pr-2 text-lg">Contact: </span>
          <span>{user.phone_number}</span>
        </p>
      )}
      <p className="flex py-1 items-center text-lg">
        <span className="flex font-semibold pr-2 text-lg">
          Total Questions:{" "}
        </span>
        <span>{user?.questionsAsked.length || 0}</span>
      </p>
      <p className="flex py-1 items-center text-lg">
        <span className="flex font-semibold pr-2 text-lg">Bio: </span>
        <span>{user?.bio || "none"}</span>
      </p>
    </div>
  );
};

export default UserDetails;
