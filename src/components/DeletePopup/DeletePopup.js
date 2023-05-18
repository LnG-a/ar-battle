import { useState, useEffect, useContext } from "react";
import { db, storage } from "../../Firebase/Firebase";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import Navbar from "../../components/Navbar/Navbar";
import { auth } from "../../Firebase/Firebase";
import { deleteObject, ref } from "firebase/storage";

function DeletePopup(data) {
  const mapsCollectionRef = collection(db, "map");

  const handleDelete = async (id) => {
    try {
      const mapDoc = doc(mapsCollectionRef, id);
      const mapData = (await getDoc(mapDoc)).data();
      const imageRef = ref(storage, `map/${mapData.image_name}`);
      const videoRef = ref(storage, `video/${mapData.video_name}`);
      await deleteDoc(mapDoc);
      await deleteObject(imageRef);
      await deleteObject(videoRef);
    } catch (error) {
      console.log(error);
    }
  };

  return <div>{data.id}</div>;
}

export default DeletePopup;
