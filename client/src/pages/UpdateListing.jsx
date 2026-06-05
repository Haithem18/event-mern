import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const [files, SetFiles] = useState([]);

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
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: prev.imageUrls.concat(urls),
          }));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed. (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload 6 images per listing.");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my_preset');

      fetch('https://api.cloudinary.com/v1_1/dokbrjdcr/image/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) resolve(data.secure_url);
          else reject('Upload failed');
        })
        .catch(reject);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "entertainment" || e.target.id === "scientific") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (["isOnline", "free", "offer"].includes(e.target.id)) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");

      if (+formData.ticketPrice < +formData.discountPrice)
        return setError("Discount price cannot be higher than regular price");

      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-8">

        <h1 className="text-4xl font-black text-center mb-10 text-gray-800">
          Update Event
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Event Name"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />

            <textarea
              placeholder="Description"
              className="w-full p-3 border rounded-xl h-32 focus:ring-2 focus:ring-black outline-none"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />

            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            {/* OPTIONS */}
            <div className="grid grid-cols-2 gap-3 text-sm">

              {[
                { id: "entertainment", label: "Entertainment" },
                { id: "scientific", label: "Scientific" },
                { id: "isOnline", label: "Online" },
                { id: "free", label: "Free" },
                { id: "offer", label: "Offer" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    id={item.id}
                    onChange={handleChange}
                    checked={
                      item.id === "entertainment"
                        ? formData.type === "entertainment"
                        : item.id === "scientific"
                        ? formData.type === "scientific"
                        : formData[item.id]
                    }
                    className="w-4 h-4"
                  />
                  {item.label}
                </label>
              ))}
            </div>

            {/* NUMBERS */}
            <div className="space-y-3">

              <input
                type="number"
                id="nbrP"
                min="1"
                max="10"
                className="w-full p-3 border rounded-xl"
                onChange={handleChange}
                value={formData.nbrP}
              />

              <input
                type="number"
                id="ticketPrice"
                className="w-full p-3 border rounded-xl"
                onChange={handleChange}
                value={formData.ticketPrice}
              />

              {formData.offer && (
                <input
                  type="number"
                  id="discountPrice"
                  className="w-full p-3 border rounded-xl"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
              )}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">

            <div className="flex gap-2">
              <input
                onChange={(e) => SetFiles(Array.from(e.target.files))}
                className="w-full p-3 border rounded-xl"
                type="file"
                multiple
              />

              <button
                type="button"
                onClick={handleImageSubmit}
                disabled={uploading}
                className="px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? "..." : "Upload"}
              </button>
            </div>

            {imageUploadError && (
              <p className="text-red-600 text-sm">{imageUploadError}</p>
            )}

            {/* IMAGES GRID */}
            <div className="grid grid-cols-2 gap-3">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="relative border rounded-xl overflow-hidden"
                >
                  <img
                    src={url}
                    alt="listing"
                    className="h-28 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <button
              disabled={loading || uploading}
              type="submit"
              className="w-full p-3 bg-black text-white rounded-xl hover:bg-gray-800"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateListing;