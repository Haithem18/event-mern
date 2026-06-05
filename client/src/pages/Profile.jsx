import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = async (file) => {
    const formDataImage = new FormData();
    formDataImage.append("file", file);
    formDataImage.append("upload_preset", "my_preset");

    try {
      setFileUploadError(false);
      setFilePerc(30);

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dokbrjdcr/image/upload",
        {
          method: "POST",
          body: formDataImage,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFilePerc(100);
        setFormData({ ...formData, avatar: data.secure_url });
      } else {
        setFileUploadError("Upload failed");
      }
    } catch {
      setFileUploadError("Upload failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) return;

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* HEADER */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">

          <h1 className="text-3xl sm:text-4xl font-extrabold">
            YOUR <span className="text-gray-500">PROFILE</span>
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Manage your account and events
          </p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">

        {/* PROFILE CARD */}
        <div className="md:col-span-1 border border-gray-200 p-6 rounded-xl">

          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">

            <img
              onClick={() => fileRef.current.click()}
              src={
                formData.avatar ||
                currentUser.avatar ||
                "https://ui-avatars.com/api/?name=User&background=111827&color=fff&size=128"
              }
              className="h-28 w-28 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
              alt="profile"
            />

            <p className="text-xs text-gray-500">
              Click avatar to change
            </p>

            {fileUploadError && (
              <p className="text-red-500 text-xs">{fileUploadError}</p>
            )}

            {filePerc > 0 && filePerc < 100 && (
              <p className="text-gray-500 text-xs">
                Uploading {filePerc}%
              </p>
            )}

            {filePerc === 100 && (
              <p className="text-green-600 text-xs">Uploaded</p>
            )}

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <input
              type="text"
              id="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Username"
            />

            <input
              type="email"
              id="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Email"
            />

            <input
              type="password"
              id="password"
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Password"
            />

            <button
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

          </form>

          {/* ACTIONS */}
          <div className="flex justify-between mt-5 text-sm">

            <span
              onClick={handleDeleteUser}
              className="text-red-500 cursor-pointer"
            >
              Delete
            </span>

            <span
              onClick={handleSignOut}
              className="text-gray-600 cursor-pointer"
            >
              Sign out
            </span>

          </div>

          <Link
            to="/create-listing"
            className="block text-center mt-6 bg-gray-100 p-3 rounded-lg hover:bg-gray-200"
          >
            Create Event
          </Link>

          {error && (
            <p className="text-red-500 text-sm mt-4">{error}</p>
          )}

          {updateSuccess && (
            <p className="text-green-600 text-sm mt-4">
              Profile updated
            </p>
          )}

        </div>

        {/* LISTINGS */}
        <div className="md:col-span-2">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">
              YOUR EVENTS
            </h2>

            <button
              onClick={handleShowListings}
              className="text-sm text-gray-600 hover:text-black"
            >
              Load
            </button>
          </div>

          {showListingsError && (
            <p className="text-red-500">Error loading listings</p>
          )}

          <div className="space-y-4">

            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >

                <Link
                  to={`/listing/${listing._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={listing.imageUrls[0]}
                    className="h-14 w-14 rounded-lg object-cover"
                  />

                  <span className="font-medium">
                    {listing.name}
                  </span>
                </Link>

                <div className="flex gap-4 text-sm">

                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>

                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="text-green-600"
                  >
                    Edit
                  </Link>

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;