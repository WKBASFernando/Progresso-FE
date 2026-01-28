import React, { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ firstname: "", lastname: "" });
  const [loading, setLoading] = useState(false);

  // 1. Fetch User Data on Load
  // Updated path to include the /api/progresso prefix
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest("/api/progresso/user/me");
        setUser(res.data);
        setFormData({
          firstname: res.data.firstname,
          lastname: res.data.lastname,
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle Profile Update
  // Updated path to include the /api/progresso prefix
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest(
        "/api/progresso/user/update",
        "PUT",
        formData
      );
      setUser(res.data);
      setIsEditing(false);
      alert("Profile Sync Successful! 🚀");
    } catch (err) {
      alert("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Avatar Upload
  // Updated path to include the /api/progresso prefix
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("/api/progresso/user/avatar", "POST", {
          image: reader.result,
        });
        setUser({ ...user, avatarUrl: res.url });
        alert("Avatar uploaded to Cloudinary! ✨");
      } catch (err) {
        alert("Upload failed!");
      } finally {
        setLoading(false);
      }
    };
  };

  if (!user)
    return <div className="p-10 font-black">INITIALIZING PLAYER...</div>;

  return (
    <div className="min-h-screen bg-yellow-50 p-6 flex flex-col items-center font-sans">
      {/* HEADER */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-10">
        <Link
          to="/dashboard" // Updated to match your Dashboard route
          className="bg-white border-3 border-black px-4 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
        >
          ← BACK TO TREE
        </Link>
        <h1 className="text-3xl font-black uppercase italic">Player Profile</h1>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white w-full max-w-md p-8 rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-blue-100 shadow-[4px_4px_0px_0px_black]">
              <img
                src={
                  user.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstname}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-green-400 border-2 border-black p-2 rounded-full cursor-pointer hover:bg-green-300 transition-colors shadow-[2px_2px_0px_0px_black]">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              📸
            </label>
          </div>
          <p className="mt-4 font-mono text-xs text-gray-400 uppercase tracking-widest">
            Access_Level: {user.role[0]}
          </p>
        </div>

        {/* Info Section */}
        {!isEditing ? (
          <div className="space-y-4 text-center">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase underline decoration-blue-400">
                Full Name
              </p>
              <h2 className="text-2xl font-black">
                {user.firstname} {user.lastname}
              </h2>
            </div>
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase underline decoration-pink-400">
                Email Address
              </p>
              <p className="font-bold text-lg">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 bg-blue-400 border-3 border-black rounded-xl font-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all mt-4"
            >
              EDIT IDENTITY
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="font-black text-xs uppercase">First Name</label>
              <input
                value={formData.firstname}
                onChange={(e) =>
                  setFormData({ ...formData, firstname: e.target.value })
                }
                className="w-full p-2 border-2 border-black rounded-lg bg-gray-50 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="font-black text-xs uppercase">Last Name</label>
              <input
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
                className="w-full p-2 border-2 border-black rounded-lg bg-gray-50 font-bold"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-green-400 border-3 border-black rounded-xl font-black shadow-[4px_4px_0px_0px_black]"
              >
                {loading ? "SYNCING..." : "SAVE"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 bg-gray-200 border-3 border-black rounded-xl font-black shadow-[4px_4px_0px_0px_black]"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>

      {/* PROGRESS TRACKER */}
      <div className="w-full max-w-md mt-6 p-4 bg-white border-3 border-black rounded-2xl shadow-[4px_4px_0px_0px_black] flex items-center justify-between">
        <span className="font-black text-sm uppercase">Skill Points:</span>
        <span className="bg-yellow-300 px-3 py-1 border-2 border-black rounded-full font-bold">
          1,250 XP
        </span>
      </div>
    </div>
  );
};

export default Profile;
