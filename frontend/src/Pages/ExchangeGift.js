import React from "react";
import { BsCoin } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "./../Constants/Url";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import { toast } from "react-toastify";

const ExchangeGift = () => {
  const [gifts, setGifts] = useState([]);
  const [isExchangeOpen, setExchangeOpen] = useState(false);

  const { id } = useParams();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const user = useSelector((state) => state.login.userDetails);

  const getGifts = async () => {
    try {
      let giftUrl;
      if (id < 0) {
        giftUrl = `${url}/gifts`;
      } else {
        giftUrl = `${url}/exchange/${user._id}`;
      }
      console.log("ur", giftUrl);
      const response = await axios.get(giftUrl);
      {
        id < 0
          ? setGifts(response?.data?.data?.gifts)
          : setGifts(response?.data?.data?.Exchanges);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const exchangeGift = async (gift_id) => {
    try {
      const body = { gift_id: gift_id, user_id: user._id };
      const response = await axios.post(`${url}/exchange`, body);
      console.log("gifres", response);
      toast("Gift exchanged successfully");
    } catch (err) {
      if (err?.response?.data?.message === "failed") {
        toast("Insufficient coins");
      } else {
        toast("An error occured");
      }
    }
  };

  useEffect(() => {
    getGifts();
  }, [id]);

  if (gifts && gifts.length === 0) {
    return <div>No gifts</div>;
  }

  console.log("gif", gifts);

  return (
    <div className="pt-[100px]">
      {isLoggedIn && id < 0 && (
        <Link to={`/exchangegift/${user?._id}`} className="mt-8 py-4px-8">
          <Button variant="outlined" className="">
            View Exchange History
          </Button>
        </Link>
      )}
      <p className="font-bold text-3xl py-8 text-center">
        {id < 0 ? "Exchange Gift" : "Gift History"}
      </p>

      <div className="flex flex-wrap w-full">
        {gifts &&
          gifts.map((gift) => (
            <div className="w-[350px] text-center h-[400px] my-4 mx-8 items-center justify-center cursor-pointer border-gray-400 rounded-lg p-2">
              {/* <img
                src={`http://localhost:5000/static/gifts/${gift.gift_image}`}
                alt="gift"
              />
              <p className="font-semibold text-lg">{gift?.gift_name}</p>
              <p className="w-full justify-center flex py-2 items-center">
                <BsCoin className="" />
                {gift?.gift_price}
              </p>
              <Button variant="outlined">Exchange</Button> */}
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  {/* <CardMedia
                    component="img"
                    height="140"
                    image={`http://localhost:5000/static/gifts/${gift.gift_image}`}
                    alt="green iguana"
                  /> */}
                  <CardMedia className="h-[150px] w-full bg-login">
                    <img
                      src={
                        id < 0
                          ? `http://localhost:5000/static/gifts/${gift.gift_image}`
                          : `http://localhost:5000/static/gifts/${gift?.gift?.gift_image}`
                      }
                      className="cover h-full w-full"
                      alt="prod"
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {id < 0 ? gift?.gift_name : gift?.gift?.gift_name}
                    </Typography>
                    <Typography gutterBottom variant="p" component="div">
                      {id < 0 ? gift?.gift_price : gift?.gift?.gift_price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {id < 0
                        ? gift?.gift_description
                        : gift?.gift?.gift_description}
                    </Typography>
                  </CardContent>
                  {id < 0 && (
                    <CardActions className=" flex items-center justify-center">
                      <Button
                        size="large"
                        variant="outlined"
                        color="primary"
                        onClick={() => exchangeGift(gift._id)}
                      >
                        Exchange
                      </Button>
                    </CardActions>
                  )}

                  {id > 0 && (
                    <Typography variant="p" color="text.secondary">
                      Exchanged: {gift.createdAt}
                    </Typography>
                  )}
                </CardActionArea>
              </Card>
            </div>
          ))}
        {gifts && gifts.length < 1 && (
          <div className="my-8">
            <p>No gifts found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeGift;
