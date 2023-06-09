import React from "react";
import "./MapUploader.css";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../Firebase/Firebase";
import { v4 } from "uuid";
import AuthDetails from "../../components/AuthDetails";
import Navbar from "../../components/Navbar/Navbar";

function MapUploader() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "map/");

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `map/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="container">
      <Navbar />
      {/* <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}> Upload Image</button>
      {imageUrls.map((url) => {
        return <img src={url} />;
        // return (
        //   <video width="1920" height="1080" controls>
        //     <source src={url} />
        //   </video>
        // );
      })} */}
    </div>
  );
}

export default MapUploader;
