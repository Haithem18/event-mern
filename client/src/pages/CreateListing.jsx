import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "scientific",
    nbrP: 1,
    ticketPrice: 0,
    discountPrice: 0,
    offer: false,
    isOnline: false,
    free: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  /* ================= CLOUDINARY ================= */
  const storeImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dokbrjdcr/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    if (!result.secure_url) {
      throw new Error("Image upload failed");
    }

    return result.secure_url;
  };

  const handleImageSubmit = async () => {
    if (files.length === 0) return;

    try {
      setUploading(true);
      setImageUploadError(false);

      const urls = await Promise.all(files.map(storeImage));

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));

      setUploading(false);
    } catch (err) {
      setUploading(false);
      setImageUploadError("Upload failed");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "entertainment" || id === "scientific") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
      return;
    }

    if (id === "isOnline" || id === "free" || id === "offer") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "nbrP" ||
        id === "ticketPrice" ||
        id === "discountPrice"
          ? Number(value)
          : value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("You must be logged in");
      return;
    }

    if (formData.imageUrls.length === 0) {
      setError("Upload at least one image");
      return;
    }

    if (formData.discountPrice > formData.ticketPrice) {
      setError("Discount cannot be higher than price");
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(
        "http://localhost:3000/api/listing/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Server error");
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">
          Create Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 sm:p-10 grid lg:grid-cols-2 gap-10"
        >

          {/* LEFT */}
          <div className="space-y-4">

            <input
              id="name"
              type="text"
              placeholder="Event name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            />

            <textarea
              id="description"
              placeholder="Event description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 h-32"
              required
            />

            <input
              id="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            />

            {/* CHECKBOXES */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ["entertainment", "Entertainment"],
                ["scientific", "Scientific"],
                ["isOnline", "Online"],
                ["free", "Free"],
                ["offer", "Offer"],
              ].map(([id, label]) => (
                <label key={id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={id}
                    checked={
                      id === "entertainment" || id === "scientific"
                        ? formData.type === id
                        : formData[id]
                    }
                    onChange={handleChange}
                  />
                  {label}
                </label>
              ))}
            </div>

            <input
              id="nbrP"
              type="number"
              value={formData.nbrP}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              id="ticketPrice"
              type="number"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              id="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />

            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>

            <div className="grid grid-cols-2 gap-2">
              {formData.imageUrls.map((url, i) => (
                <div key={i}>
                  <img
                    src={url}
                    className="h-20 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

          </div>

        </form>
      </div>
    </main>
  );
};

export default CreateListing;