import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [totalPotentialXp, setTotalPotentialXp] = useState(5000);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Fetch User Data
        const user = await apiRequest("/api/progresso/user/me");
        setUserData(user);

        // 2. Fetch Skills to confirm total
        await apiRequest("/api/progresso/skill");
        setTotalPotentialXp(5000);
      } catch (err) {
        console.error("Profile sync failed", err);
      }
    };
    fetchProfileData();
  }, []);

  // --- AVATAR UPDATE HANDLER ---
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    setUploading(true);
    try {
      // Calls your existing avatar upload route
      const res = await apiRequest(
        "/api/progresso/user/avatar",
        "POST",
        formData
      );
      setUserData({ ...userData, avatarUrl: res.avatarUrl });
      alert("Identity visualization updated!");
    } catch (err) {
      alert("Avatar upload failed. Check connection.");
    } finally {
      setUploading(false);
    }
  };

  if (!userData)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FFFBEB] font-black animate-pulse">
        SYNCING_IDENTITY...
      </div>
    );

  return (
    <div className="p-8 bg-[#FFFBEB] min-h-screen font-sans text-black">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* --- PLAYER INFO & AVATAR SECTION --- */}
        <section className="bg-white border-4 border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_black] flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-yellow-200 shadow-[4px_4px_0px_0px_black]">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            {/* HIDDEN FILE INPUT */}
            <label className="absolute bottom-0 right-0 bg-blue-400 border-2 border-black p-2 rounded-full cursor-pointer hover:bg-blue-300 transition-all shadow-[2px_2px_0px_0px_black]">
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              <span className="text-xs font-black">
                {uploading ? "..." : "EDIT"}
              </span>
            </label>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {userData.firstname} {userData.lastname}
            </h1>
            <p className="font-mono text-sm text-slate-500">{userData.email}</p>
            <div className="mt-2 inline-block bg-black text-green-400 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase">
              RANK: {userData.role?.[0] || "PLAYER"}
            </div>
          </div>
        </section>

        {/* --- XP HUD --- */}
        <section className="bg-white border-4 border-black rounded-[32px] p-10 shadow-[12px_12px_0px_0px_black]">
          <div className="mb-8">
            <p className="text-xs font-[900] uppercase tracking-widest text-slate-400 mb-2">
              Progress_Status
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black italic tracking-tighter">
                {userData.xp || 0}
              </span>
              <span className="text-2xl font-black text-slate-300">
                / {totalPotentialXp} XP
              </span>
            </div>
            <div className="w-full h-6 bg-slate-100 border-4 border-black rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-green-400 border-r-4 border-black transition-all duration-700"
                style={{
                  width: `${((userData.xp || 0) / totalPotentialXp) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_black]">
              <p className="text-[10px] font-black uppercase">Current_Rank</p>
              <p className="text-2xl font-black italic">
                LEVEL_{userData.level || 1}
              </p>
            </div>
            <div className="bg-pink-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_black]">
              <p className="text-[10px] font-black uppercase">Nodes_Mastered</p>
              <p className="text-2xl font-black italic">
                {userData.completedSkills?.length || 0}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
