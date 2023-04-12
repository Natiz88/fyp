import React from "react";

const Split = (text, img, flex = "flex") => {
  return (
    <div>
      <div className={`${flex} justify-between `}>
        <div>
          <img src={img} alt="img" />
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Split;
