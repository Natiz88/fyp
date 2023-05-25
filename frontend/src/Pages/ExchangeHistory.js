import LeftSidebar from "../components/LeftSideBar";
import RightSidebar from "../components/RightSideBar";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ExchangeHistory = () => {
  const [isLoading, setLoading] = useState(false);
  return (
    <div className="w-full md:w-11/12 m-auto flex justify-between">
      <LeftSidebar />
      {isLoading ? (
        <div className="w-full lg:w-3/6 mt-[120px] lg:mt-[80px] flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full min-h-[300px] lg:w-3/6 mt-[120px] lg:mt-[80px] "></div>
      )}
    </div>
  );
};

export default ExchangeHistory;
