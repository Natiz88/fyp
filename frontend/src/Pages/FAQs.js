import React, { useState, useEffect } from "react";
import LeftSidebar from "./../components/LeftSideBar";
import RightSidebar from "./../components/RightSideBar";
import axios from "axios";
import { url } from "./../Constants/Url";
import QuizIcon from "@mui/icons-material/Quiz";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const FAQs = () => {
  const [isLoading, setLoading] = useState(false);
  const [faq, setFaq] = useState([]);
  const [isFAQ1, setIsFAQ1] = useState("");

  const getFAQs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/faq`);
      setFaq(response?.data?.data?.FAQs);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFAQs();
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
              <QuizIcon className="w-16" sx={{ fontSize: "80px" }} />{" "}
              <p className="text-3xl pl-8 font-bold">FAQs</p>
            </div>
          </div>
          <div className="m-4 bg-white rounded-lg">
            {faq && faq.length > 0 ? (
              faq.map((reward, i) => {
                return (
                  <div className="w-full flex flex-col items-center py-2 px-8">
                    <div
                      onClick={() =>
                        isFAQ1 !== reward?.question
                          ? setIsFAQ1(reward?.question)
                          : setIsFAQ1("")
                      }
                      className="w-full flex justify-between cursor-pointer text-lg py-2"
                    >
                      <p className="w-full ">{reward?.question}</p>
                      {isFAQ1 !== reward?.question ? (
                        <AddIcon />
                      ) : (
                        <CloseIcon />
                      )}
                    </div>
                    <p
                      className={
                        isFAQ1 === reward?.question
                          ? `w-full py-2 text-grayDark `
                          : `hidden`
                      }
                    >
                      {reward?.answer}
                    </p>
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

export default FAQs;
