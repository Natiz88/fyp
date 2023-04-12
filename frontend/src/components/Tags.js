import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "./../Constants/Url";
import { Link } from "react-router-dom";

const Tags = () => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    getPopulaTags();
  }, []);

  const getPopulaTags = async () => {
    try {
      const response = await axios.get(`${url}/questions/popularTags`);
      setTags(response?.data?.data?.tags);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h3 className="font-semibold text-md py-2">Top Tags</h3>
      {tags.length > 0 &&
        tags.map((tag) => (
          <Link to={`/BrowsePosts?tag=${tag._id}`}>
            <p className="py-2 cursor-pointer pl-4">
              {tag._id} ({tag.count})
            </p>
          </Link>
        ))}
      {tags.length === 0 && <p>No result</p>}
    </div>
  );
};

export default Tags;
