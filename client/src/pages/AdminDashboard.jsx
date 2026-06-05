import { updateCurrentUser } from "firebase/auth";
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
  try {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${updateCurrentUser.token}` },
      credentials: "include",
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Échec de récupération des utilisateurs");
    }
    const data = await res.json();
    console.log("Users data:", data);
    setUsers(Array.isArray(data) ? data : data.users || []);
  } catch (err) {
    console.error("Fetch users error:", err);
    setError(err.message);
  }
};

const fetchListings = async () => {
  try {
    const res = await fetch("/api/admin/listings", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      credentials: "include",
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Échec de récupération des événements");
    }
    const data = await res.json();
    console.log("Listings data:", data);
    setListings(Array.isArray(data) ? data : data.listings || []);
  } catch (err) {
    console.error("Fetch listings error:", err);
    setError(err.message);
  }
};



    fetchUsers();
    fetchListings();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (!res.ok) throw new Error("Échec de suppression de l'utilisateur");
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet événement ?")) return;
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (!res.ok) throw new Error("Échec de suppression de l'événement");
      setListings(listings.filter((listing) => listing._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Administrateur</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Utilisateurs</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Nom d'utilisateur</th>
              <th className="border border-gray-300 p-2">Adresse e-mail</th>
              <th className="border border-gray-300 p-2">Administrateur</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.isAdmin ? "Oui" : "Non"}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Événements</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Titre de l'événement</th>
              <th className="border border-gray-300 p-2">Type d'événement</th>
              <th className="border border-gray-300 p-2">Offre spéciale</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id}>
                <td className="border border-gray-300 p-2">{listing.title}</td>
                <td className="border border-gray-300 p-2">{listing.type}</td>
                <td className="border border-gray-300 p-2">{listing.offer ? "Oui" : "Non"}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => deleteListing(listing._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
