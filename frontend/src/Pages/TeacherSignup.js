import React, { useState } from "react";
import ProfileEdit from "../components/ProfileEdit";
import Signup from "./Signup";
import UploadDocument from "./../components/UploadDocuments";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useSelector } from "react-redux";

const steps = ["Login credentials", "Personal Information", "Upload Documents"];

export default function TeacherSignup({ editStep = 0 }) {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  const [activeStep, setActiveStep] = useState(isLoggedIn ? 1 : editStep);
  const changeStep = (step) => {
    setActiveStep(step);
  };
  return (
    <div className="w-full bg-white py-8">
      <h1 className="text-center pb-4 text-lg font-semibold">Teacher Signup</h1>
      <Stepper activeStep={activeStep} alternativeLabel className="w-full p-8">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className="w-4/5 m-auto py-8">
        {activeStep === 0 && (
          <Signup
            type="teacher"
            activeStep={activeStep}
            changeStep={changeStep}
          />
        )}
        {activeStep === 1 && (
          <ProfileEdit
            type="teacher"
            activeStep={activeStep}
            changeStep={changeStep}
          />
        )}
        {activeStep === 2 && (
          <UploadDocument activeStep={activeStep} changeStep={changeStep} />
        )}
      </div>
    </div>
  );
}
