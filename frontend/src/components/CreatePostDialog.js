import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@mui/material";

const CreatePostDialog = () => {
  const quillRef = useRef();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "background",
    "align",
    "size",
  ];

  const [value, setValue] = useState("");
  const handleContentChange = (content) => {
    setValue(content);
  };
  const postQuestion = () => {
    console.log("quill", value);
  };
  return (
    <div className="p-8 prose h-96">
      <div className="w-full flex justify-between">
        <Button type="cancel" variant="outlined" onClick={postQuestion}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" onClick={postQuestion}>
          Post
        </Button>
      </div>
      <h3>Enter Your Question</h3>
      <div>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value}
          onChange={handleContentChange}
          className="h-max w-full md:w-[500px]"
          // style={{ height: "200px", width: "500px" }}
        />
      </div>
      <div>
        <h4>Select Tags</h4>
      </div>
    </div>
  );
};

export default CreatePostDialog;
