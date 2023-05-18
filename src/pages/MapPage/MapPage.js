import { useState, useEffect, useContext } from "react";
import "./MapPage.css";
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
import AddPopup from "../../components/AddPopup/AddPopup";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

function MapPage() {
  const mapsCollectionRef = collection(db, "map");
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [updatePopup, setUpdatePopup] = useState(false);
  const [updateID, setUpdateID] = useState("");
  const [errors, setErrors] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  // const [imageUrl, setImageUrl] = useState("");
  const [videoUpload, setVideoUpload] = useState(null);
  // const [videoUrl, setVideoUrl] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("Cập nhật");

  function triggerDelete(id) {
    setDeleteID(id);
    setDeletePopup(!deletePopup);
  }

  function triggerUpdate(id, name) {
    setUpdateID(id);
    setUpdateName(name);
    setUpdatePopup(!updatePopup);
    setUpdateStatus("Cập nhật");
    setImageUpload(null);
    setVideoUpload(null);
    setErrors({});
  }

  async function handleDelete(id) {
    setDeletePopup(false);
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
  }

  async function handleUpdate(id) {
    let check = true;
    if (!updateName) {
      setErrors((prev) => ({
        ...prev,
        name: "Tên không được để trống!",
      }));
      check = false;
    }
    if (!check) return;

    setUpdateStatus(
      <div class="spinner-border text-light" role="status"></div>
    );
    //update
    const updated = {
      name: updateName,
      lastUpdate: serverTimestamp(),
    };

    const mapDoc = doc(mapsCollectionRef, id);
    const mapData = (await getDoc(mapDoc)).data();

    //update ảnh
    if (imageUpload !== null) {
      try {
        const delImageRef = ref(storage, `map/${mapData.image_name}`);
        await deleteObject(delImageRef);
      } catch (error) {
        console.error(error);
      }
      const imageRef = ref(storage, `map/${imageUpload.name}`);
      await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          updated.image = url;
          updated.image_name = imageUpload.name;
          try {
            updateDoc(mapDoc, updated);
          } catch (error) {
            console.error(error);
          }
        });
      });
    }

    //update video
    if (videoUpload !== null) {
      try {
        const delVideoRef = ref(storage, `video/${mapData.video_name}`);
        await deleteObject(delVideoRef);
      } catch (error) {
        console.error(error);
      }
      const videoRef = ref(storage, `video/${videoUpload.name}`);

      await uploadBytes(videoRef, videoUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updated.video = url;
          updated.video_name = videoUpload.name;
          try {
            updateDoc(mapDoc, updated);
          } catch (error) {
            console.error(error);
          }
        });
      });
    }

    try {
      await updateDoc(mapDoc, updated);
    } catch (error) {
      console.error(error);
    }

    setUpdatePopup(false);
  }

  useEffect(() => {
    const q = query(mapsCollectionRef);

    setLoading(true);
    const unsub = onSnapshot(mapsCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
      setMaps(items);
      setLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div>
      <Navbar />
      <AddPopup />

      <div className="container">
        {loading ? <h1>Loading...</h1> : null}
        <table className="table table-striped table-bordered">
          <thead className="table-success">
            <tr>
              <th>TT</th>
              <th>Tên</th>
              <th>Bản đồ</th>
              <th>Video</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((maps, index) => (
              <tr key={maps.id}>
                <td>{index + 1}</td>
                <td>{maps.name}</td>
                <td>
                  <a href={maps.image} target="_blank">
                    Link
                  </a>
                </td>
                <td>
                  <a href={maps.video} target="_blank">
                    Link
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => triggerUpdate(maps.id, maps.name)}
                  >
                    Sửa
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => triggerDelete(maps.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deletePopup && (
        <div className="popup">
          <div onClick={triggerDelete} className="overlay"></div>
          <div className="modal-content delete-popup">
            <h2>Bạn có chắc thực sự muốn xóa?</h2>
            <div className="popup-delete-buttons">
              <button
                type="button"
                class="btn btn-secondary popup-button"
                onClick={triggerDelete}
              >
                Hủy
              </button>
              <button
                type="button"
                class="btn btn-danger popup-button"
                onClick={() => handleDelete(deleteID)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {updatePopup && (
        <div className="popup">
          <div onClick={triggerUpdate} className="overlay"></div>
          <div className="modal-content">
            <form className="form">
              <h2 className="title">Cập nhật</h2>
              <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">Tên </label>
                <div class="col-sm-10">
                  <input
                    class="form-control"
                    type="text"
                    value={updateName}
                    onChange={(e) =>
                      setUpdateName(
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
                  {errors.name && <span className="error">{errors.name}</span>}
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
                </div>
              </div>
              <div className="popup-buttons">
                <button
                  type="button"
                  class="btn btn-secondary popup-button"
                  onClick={triggerUpdate}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  class="btn btn-primary popup-button"
                  onClick={() => handleUpdate(updateID)}
                >
                  {updateStatus}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapPage;
