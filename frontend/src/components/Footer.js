import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { modalActions } from "../Redux/ModalReducer";

const Footer = () => {
  const dispatch = useDispatch();
  const year = new Date().getFullYear();
  return (
    <div className="w-full py-12 lg:px-32 bg-black text-white">
      <div className="flex justify-around">
        <div className="w-1/4">
          <p
            className="cursor-pointer py-2"
            onClick={() => dispatch(modalActions.openContactUsModal())}
          >
            Contact Us
          </p>
          <Link to="/">
            <p className="cursor-pointer py-2">About Us</p>
          </Link>
          <Link to="/faqs">
            <p className="cursor-pointer py-2">FAQs</p>
          </Link>
          <p className="cursor-pointer py-2">Privacy Policy</p>
          <p className="cursor-pointer py-2">Cookie Policy</p>
          <p className="cursor-pointer py-2">Terms and Conditions</p>
        </div>
        <div className="w-2/5">
          <p className="font-semibold text-sm md:text-lg">About Us</p>
          <p className="text-sm md:text-md w-4/5 py-2 tracking-wide">
            AnswerOut is an online platform that places emphasis on using the
            benefit of shared interests to draw people especially students
            seeking answers to their questions. The users put up questions
            expecting an answer and go through previously asked questions where
            they might find their answer or even get more information about a
            similar topic.
          </p>
        </div>
        <div className="w-1/4">
          <p className="font-semibold text-md md:text-lg">Customer Service</p>
          <p className="text-sm md:text-md w-4/5 py-2 tracking-wide">
            For any queries, please contact us:
          </p>
          <p className="pt-2 text-sm md:text-md w-4/5 tracking-wide">
            answerout@gmail.com
          </p>
          <p className="text-sm md:text-md w-4/5 tracking-wide">9804023447</p>
        </div>
      </div>
      <div className="w-full pt-8 flex justify-end">
        <p className="text-sm md:text-md tracking-wide">
          © {year} AnswerOut Pvt. Ltd. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
