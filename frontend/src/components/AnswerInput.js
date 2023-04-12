import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { url } from "./../Constants/Url";

const AnswerInput = ({
  question,
  postAnswerSubmit,
  img = [],
  body = "",
  editMode = false,
}) => {
  const [images, setImages] = useState(img);
  const [imgPreviews, setImgPreviews] = useState(img);
  const [answerBody, setAnswerBody] = useState(body);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    const id = Math.random();
    setImages([...images, { id, file }]);
    onPreviews(id, file);
  };

  const onPreviews = (id, file) => {
    setImgPreviews([...imgPreviews, { id, file: URL.createObjectURL(file) }]);
  };
  const deleteImage = (img) => {
    setImgPreviews([...imgPreviews.filter((image) => image.id !== img.id)]);
    setImages([...images.filter((image) => image.id !== img.id)]);
  };

  const postAnswerData = () => {
    const data = new FormData();
    data.append("answer_body", answerBody);
    images.forEach((image) => data.append("answer_images", image.file));
    data.append("question_id", question?._id);
    setImgPreviews([]);
    setAnswerBody("");
    return postAnswerSubmit(data);
  };

  return (
    <div className="m-4 relative">
      <TextField
        fullWidth
        multiline
        id="body"
        label="Answer here.."
        name="body"
        autoComplete="off"
        rows={6}
        value={answerBody}
        onChange={(e) => setAnswerBody(e.target.value)}
      />
      <div className="w-full absolute bottom-0 left-0">
        <div className="absolute w-4/5 h-[80px] flex items-center bottom-0">
          <div className=" h-3/4 flex ">
            {imgPreviews.map((image) => (
              <div className="w-24 mx-1 border border-[#D3D3D3] relative cursor-pointer">
                <div
                  className="absolute top-1 right-1"
                  onClick={() => deleteImage(image)}
                >
                  <CloseIcon />
                </div>
                <img alt="a" src={image.file} className="w-full h-full" />
              </div>
            ))}
          </div>
          {imgPreviews.length < 4 && (
            <div className="relative w-16 h-3/6 cursor-pointer flex items-center justify-center">
              <input
                type="file"
                onChange={onImageChange}
                className="z-0 w-full h-full absolute top-0 left-0 opacity-0"
              />
              <ImageIcon className="w-full h-full" />
            </div>
          )}
        </div>
        <div className="w-full flex justify-end p-2">
          <Button variant="contained" onClick={postAnswerData}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AnswerInput;
