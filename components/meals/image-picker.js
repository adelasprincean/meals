"use client";

import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

const ImagePicker = ({ label, name }) => {
  // State to store the picked image
  const [pickedImage, setPickedImage] = useState();

  // Ref for the hidden file input
  const imageInput = useRef();

  // Opens the file input dialog when the "Pick an Image" button is clicked
  const handlePickClick = () => {
    imageInput.current.click();
  };

  // Handles the change event of the file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // If no file is selected, set pickedImage to null
    if (!file) {
      setPickedImage(null);
      return;
    }

    // Read the selected image and set it in the state
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div className={classes.picker}>
      {/* Label for the file input */}
      <label htmlFor={name}>{label}</label>

      {/* Image preview and file input */}
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>

        {/* Hidden file input */}
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />

        {/* Button to trigger file input */}
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
