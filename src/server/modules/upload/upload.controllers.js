import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import formidable from "formidable-serverless";

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

import admin from "firebase-admin";

import serviceAccount from "./celiamedapp-firebase-adminsdk-g6c7f-2ac8e74a1f.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://celiamedapp.appspot.com",
});

export async function uploadfile(req, res, next) {
  const form = new formidable.IncomingForm({ multiples: true });
  try {
    form.parse(req, async (err, fields, files) => {
      var downLoadPath =
        "https://firebasestorage.googleapis.com/v0/b/celiamedapp.appspot.com/o/";

      const types = ["image/png", "image/jpeg"];

      console.log(files.img);

      if (err) {
        return res.status(400).json({
          message: "There was an error parsing the files",
          data: {},
          error: err,
        });
      }

      if (!files.img || !types.includes(files.img.type)) {
        return res.status(BAD_REQUEST).json({
          message: "File type must be png or jpeg",
        });
      }
      if (files.img.size / 1000000 > 3) {
        return res.status(BAD_REQUEST).json({
          message: "File size must be less than 3 mb",
        });
      }

      const dateTime = giveCurrentDateTime();
      const storageRef = sRef(
        storage,
        `files/${files.img.name + "  " + dateTime}`
      );
      // Create file metadata including the content type
      const metadata = {
        contentType: files.img.type,
      };

      console.log(files.img.path);
      // Upload the file in the bucket storage
      // const snapshot = await uploadBytesResumable(
      //   storageRef,
      //   req.files.img.data,
      //   metadata
      // );

      const bucket = admin.storage().bucket();

      const imageResponse = await bucket.upload(files.img.path, {
        destination: `files/${files.img.name + "  " + dateTime}`,
        resumable: true,
        metadata: {
          contentType: files.img.type,
        },
      });

      // console.log(snapshot);
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
      // Grab the public url
      // const downloadURL = await getDownloadURL(snapshot.ref);

      let imageUrl =
        downLoadPath +
        encodeURIComponent(imageResponse[0].name) +
        "?alt=media&token=";

      console.log(imageUrl);

      return res.send({
        message: "file upload successful",
        name: files.img.name,
        type: files.img.mimetype,
        downloadURL: imageUrl,
      });
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
