import React from "react";
import { gifts } from "./../Constants/Gifts";
import { Button } from "@mui/material";
import { BsCoin } from "react-icons/bs";

const ExchangeGift = () => {
  return (
    <div className="pt-[100px]">
      <p className="font-bold text-3xl py-8 text-center">Exchange Gift</p>
      <div className="flex flex-wrap w-full  ">
        {gifts.map((gift) => (
          <div className="w-1/5 text-center h-[400px] my-4 mx-8 items-center justify-center cursor-pointer border-black hover:border rounded-lg p-2">
            <img src={gift.image} alt="gift" />
            <p className="font-semibold text-lg">{gift.name}</p>
            <p className="w-full justify-center flex py-2 items-center">
              <BsCoin className="" />
              {gift.cost}
            </p>
            <Button variant="outlined">Exchange</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeGift;
