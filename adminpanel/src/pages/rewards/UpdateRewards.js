import React, { useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";
import { url } from "../../utils/URL";
import axios from "axios";

const UpdateRewards = ({ get, rewardType = "", rewardValue = 0, id }) => {
  const [type, setType] = useState(rewardType);
  const [value, setValue] = useState(rewardValue);
  const [editMode, setEditMode] = useState(false);

  console.log("id", id);

  const updateReward = async (e) => {
    e.preventDefault();
    try {
      const data = { value };
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${url}/rewards/${id}`, data, config);
      console.log(response);
      get();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="bg-white rounded-lg dark:bg-gray-800">
      <Label>
        <span>
          Type: <span>{type}</span>
        </span>
      </Label>
      <Label className="mt-5">
        <span>Value</span>
        <Input
          className="mt-1"
          defaultValue={value}
          placeholder="0"
          onChange={(e) => setValue(e.target.value)}
        />
      </Label>
      <Button onClick={updateReward} className="m-auto mt-4">
        Update Reward
      </Button>
    </form>
  );
};

export default UpdateRewards;
