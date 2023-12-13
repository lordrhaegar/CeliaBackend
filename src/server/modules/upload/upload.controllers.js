import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { BAD_REQUEST, SERVER_ERROR } from "../../types/status_code.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCmL8vwRbhBbAtaCtG9WWyqBZpyEhgqWAA",
  authDomain: "celiamedapp.firebaseapp.com",
  projectId: "celiamedapp",
  storageBucket: "celiamedapp.appspot.com",
  messagingSenderId: "148587749422",
  appId: "1:148587749422:web:68780c916f85ca37b3bfbf",
  measurementId: "G-K5BXP79RXG",
};

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

    console.log(req.files.img.data);
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.files.img.data,
      metadata
    );

    console.log(snapshot);
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
