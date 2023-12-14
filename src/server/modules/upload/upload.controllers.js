import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import formidable from "formidable-serverless";
import admin from "firebase-admin";

import { BAD_REQUEST, SERVER_ERROR } from "../../types/status_code.js";

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

      const bucket = admin.storage().bucket();

      const imageResponse = await bucket.upload(files.img.path, {
        destination: `files/${files.img.name + "  " + dateTime}`,
        resumable: true,
        metadata: {
          contentType: files.img.type,
        },
      });

      let imageUrl =
        downLoadPath +
        encodeURIComponent(imageResponse[0].name) +
        "?alt=media&token=";

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
