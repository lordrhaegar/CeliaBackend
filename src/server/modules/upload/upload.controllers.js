import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { BAD_REQUEST, SERVER_ERROR } from "../../types/status_code.js";
import { firebaseConfig } from "../../config/firebase.config.js";

//initialize firebase
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

export async function uploadfile(req, res, next) {
  try {
    const types = ["image/png", "image/jpeg"];

    if (!req.files.img || !types.includes(req.files.img.mimetype)) {
      return res.status(BAD_REQUEST).json({
        message: "File type must be png or jpeg",
      });
    }
    if (req.files.img.size / 1000000 > 3) {
      return res.status(BAD_REQUEST).json({
        message: "File size must be less than 3 mb",
      });
    }

    const dateTime = giveCurrentDateTime();
    const storageRef = sRef(
      storage,
      `files/${req.files.img.name + "  " + dateTime}`
    );
    // Create file metadata including the content type
    const metadata = {
      contentType: req.files.img.mimetype,
    };
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.files.img.data,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    return res.send({
      message: "file upload successful",
      name: req.files.img.name,
      type: req.files.img.mimetype,
      downloadURL: downloadURL,
    });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};
