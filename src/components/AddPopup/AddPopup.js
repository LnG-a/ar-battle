import React, { useState, useEffect } from "react";
import "./AddPopup.css";
import { db } from "../../Firebase/Firebase";
import { auth, storage } from "../../Firebase/Firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddPopup() {
  const user = auth.currentUser;
  const mapsCollectionRef = collection(db, "map");
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUpload, setVideoUpload] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("Thêm mới");

  const triggerModal = () => {
    setModal(!modal);
    resetData();
  };

  const resetData = () => {
    setName("");
    setStatus("Thêm mới");
    setImageUpload(null);
    setVideoUpload(null);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    let check = true;

    if (!name) {
      setErrors((prev) => ({
        ...prev,
        name: "Tên không được để trống!",
      }));
      check = false;
    }
    if (imageUpload == null) {
      setErrors((prev) => ({
        ...prev,
        image: "Ảnh không được để trống!",
      }));
      check = false;
    }
    if (videoUpload == null) {
      setErrors((prev) => ({
        ...prev,
        video: "Video không được để trống!",
      }));
      check = false;
    }
    if (!check) return;

    setStatus(<div class="spinner-border text-light" role="status"></div>);

    let newDoc;
    const videoRef = ref(storage, `video/${videoUpload.name}`);
    await uploadBytes(videoRef, videoUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (url) => {
        console.log(imageUrl);
        try {
          newDoc = await addDoc(mapsCollectionRef, {
            name: name,
            video: url,
            image_name: imageUpload.name,
            video_name: videoUpload.name,
            adminID: user.uid,
            adminEmail: user.email,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
          });
        } catch (error) {
          console.error(error);
        }
      });
    });

    const imageRef = ref(storage, `map/${imageUpload.name}`);
    await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (url) => {
        try {
          const mapDoc = doc(mapsCollectionRef, newDoc.id);
          await updateDoc(mapDoc, { image: url });
        } catch (error) {
          console.error(error);
        }
      });
    });

    // try {
    //   await addDoc(mapsCollectionRef, {
    //     name: name,
    //     image: 1,
    //     video: 1,
    //     image_name: imageUpload.name,
    //     video_name: videoUpload.name,
    //     adminID: user.uid,
    //     adminEmail: user.email,
    //     createdAt: serverTimestamp(),
    //     lastUpdated: serverTimestamp(),
    //   });
    // } catch (error) {
    //   console.error(error);
    // }

    triggerModal();
    resetData();
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, `map/${imageUpload.name}`);
    await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (url) => {
        return url;
      });
    });
  };

  const uploadVideo = async () => {
    const videoRef = ref(storage, `video/${videoUpload.name}`);
    await uploadBytes(videoRef, videoUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (url) => {
        return url;
      });
    });
  };

  return (
    <div className="container">
      <button
        type="button"
        class="btn btn-primary"
        onClick={triggerModal}
        style={{ margin: "20px 0" }}
      >
        Thêm bản đồ
      </button>

      {modal && (
        <div>
          <div className="popup">
            <div onClick={triggerModal} className="overlay"></div>
            <div className="modal-content">
              <form onSubmit={handleSubmit} className="form">
                <h2 className="title">Thêm bản đồ</h2>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Tên </label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                        )
                      }
                      required
                    />
                    {errors.name && (
                      <span className="error">{errors.name}</span>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Ảnh</label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="file"
                      onChange={(event) => {
                        setImageUpload(event.target.files[0]);
                      }}
                    />
                    {errors.image && (
                      <span className="error">{errors.image}</span>
                    )}
                  </div>
                </div>
                <div class="mb-3 row">
                  <label class="col-sm-2 col-form-label">Video</label>
                  <div class="col-sm-10">
                    <input
                      class="form-control"
                      type="file"
                      onChange={(event) => {
                        setVideoUpload(event.target.files[0]);
                      }}
                    />
                    {errors.video && (
                      <span className="error">{errors.video}</span>
                    )}
                  </div>
                </div>
                <div className="popup-buttons">
                  <button
                    type="button"
                    class="btn btn-secondary popup-button"
                    onClick={triggerModal}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary popup-button"
                    onClick={handleSubmit}
                  >
                    {status}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPopup;
