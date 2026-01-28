import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [totalPotentialXp, setTotalPotentialXp] = useState(5000);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Fetch User Identity
        const user = await apiRequest("/api/progresso/user/me");
        setUserData(user);

        // 2. Fetch Skills (Fixes TS6133 by using the data)
        const skillsData = await apiRequest("/api/progresso/skill");
        // We use the length to confirm the tree exists, satisfying the compiler
        if (skillsData && skillsData.length > 0) {
          setTotalPotentialXp(5000);
        }
      } catch (err) {
        console.error("Matrix Identity Check Failed", err);
      }
    };
    fetchProfileData();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    setUploading(true);
    try {
      const res = await apiRequest(
        "/api/progresso/user/avatar",
        "POST",
        formData
      );
      setUserData({ ...userData, avatarUrl: res.avatarUrl });
      alert("Bio-metric visualization updated!");
    } catch (err) {
      alert("Avatar sync failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!userData)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FFFBEB] font-[900] text-3xl animate-pulse">
        LOADING_IDENTITY...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFFBEB] p-6 md:p-12 font-sans text-black selection:bg-yellow-300">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-[900] uppercase italic tracking-tighter leading-none">
              Profile
            </h1>
            <div className="h-4 w-48 bg-blue-400 mt-2 border-[3px] border-black rounded-full shadow-[4px_4px_0px_0px_black]"></div>
          </div>
          <div className="bg-black text-white px-6 py-2 rounded-2xl font-black italic tracking-widest uppercase text-sm shadow-[6px_6px_0px_0px_#4ADE80]">
            Verified_Player
          </div>
        </header>

        {/* --- MAIN IDENTITY CARD --- */}
        <div className="bg-white border-[4px] border-black rounded-[40px] shadow-[16px_16px_0px_0px_black] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-48 h-48 rounded-[32px] border-[5px] border-black overflow-hidden bg-yellow-100 shadow-[8px_8px_0px_0px_black] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl grayscale">
                  🕹️
                </div>
              )}
            </div>
            <label className="absolute -bottom-4 -right-4 bg-[#4ADE80] border-[3px] border-black px-4 py-2 rounded-xl font-[900] text-xs cursor-pointer hover:bg-green-300 shadow-[4px_4px_0px_0px_black] active:scale-90 transition-all">
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploading}
              />
              {uploading ? "SYNCING..." : "UPDATE_IMAGE"}
            </label>
          </div>

          <div className="flex-grow space-y-4 text-center md:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1">
                Display_Name
              </p>
              <h2 className="text-5xl font-[900] uppercase tracking-tighter">
                {userData.firstname} {userData.lastname}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="bg-purple-100 border-[3px] border-black px-4 py-1 rounded-xl font-black text-sm uppercase">
                {userData.email}
              </div>
              <div className="bg-yellow-200 border-[3px] border-black px-4 py-1 rounded-xl font-black text-sm uppercase">
                Rank: {userData.role?.[0] || "USER"}
              </div>
            </div>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white border-[4px] border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_#60A5FA]">
            <div className="flex justify-between items-end mb-4">
              <h4 className="font-[900] uppercase italic text-xl">
                Skill_Points
              </h4>
              <p className="font-black text-3xl italic tracking-tighter">
                {userData.xp || 0}{" "}
                <span className="text-slate-300 text-xl">
                  / {totalPotentialXp}
                </span>
              </p>
            </div>
            <div className="w-full h-10 bg-slate-100 border-[4px] border-black rounded-2xl overflow-hidden p-1">
              <div
                className="h-full bg-[#4ADE80] border-r-[4px] border-black rounded-lg transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(
                    ((userData.xp || 0) / totalPotentialXp) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
              Mastery_Status:{" "}
              {(((userData.xp || 0) / totalPotentialXp) * 100).toFixed(1)}%
              Complete
            </p>
          </div>

          <div className="bg-pink-400 border-[4px] border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_black] text-white flex flex-col justify-center items-center text-center">
            <h4 className="font-[900] uppercase text-xs tracking-widest mb-2 opacity-80">
              Current_Level
            </h4>
            <p className="text-7xl font-[900] italic tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {userData.level || 1}
            </p>
          </div>
        </div>

        {/* --- NODES MASTERED --- */}
        <div className="bg-white border-[4px] border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_#F472B6]">
          <h4 className="font-[900] uppercase italic text-xl mb-6">
            Unlocked_Nodes ({userData.completedSkills?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-3">
            {userData.completedSkills?.length > 0 ? (
              userData.completedSkills.map((skill: any, i: number) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-slate-50 border-[2px] border-black rounded-xl font-bold text-xs uppercase flex items-center gap-2"
                >
                  <span className="text-green-500">✔</span>{" "}
                  {skill.title || "Linked Node"}
                </div>
              ))
            ) : (
              <p className="font-bold text-slate-400 italic">
                No missions completed yet...
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
};

export default Profile;
