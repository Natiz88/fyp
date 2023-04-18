import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Pages/Navbar";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import ExchangeGift from "./Pages/ExchangeGift";
import BrowsePosts from "./Pages/BrowsePosts";
import CreatePost from "./Pages/CreatePost";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import PageDetails from "./Pages/PageDetails";
import LandingPage from "./Pages/LandingPage";
import LeaderBoard from "./Pages/LeaderBoard";
import RewardsLog from "./Pages/RewardsLog";
import FAQs from "./Pages/FAQs";
import TeacherSignup from "./Pages/TeacherSignup";
import ResetPassword from "./Pages/ResetPassword";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const [data, setData] = useState("random");
  const isScreenLoading = useSelector((state) => state.screen.isScreenLoading);

  const doSomething = (arg1, component) => {
    console.log(arg1);
    return component;
  };

  return (
    <div className="bg-secondary">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/BrowsePosts" element={<BrowsePosts />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/exchangegift" element={<ExchangeGift />} />
          <Route path="/teacherSignup" element={<TeacherSignup />} />
          <Route path="/rewardsLog" element={<RewardsLog />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/resetpassword/:id/:token" element={<LandingPage />} />
          <Route path="/pageDetails/:id" element={<PageDetails />} />
        </Routes>
        <CreatePost />
        <Sidebar />
        <Footer />
        {isScreenLoading && (
          <div className="fixed top-0 left-0 w-screen h-screen mix-blend-multiply bg-black opacit-40 flex justify-center items-center z-50">
            <CircularProgress />
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
