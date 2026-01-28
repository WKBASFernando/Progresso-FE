import React, { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [totalPotentialXp, setTotalPotentialXp] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 1. Fetch User Data (Left Side)
        const user = await apiRequest("/api/progresso/user/me");
        setUserData(user);

        // 2. Fetch Skills to calculate Total XP (Right Side)
        const skills = await apiRequest("/api/progresso/skill");

        // We calculate based on our backend logic: (5000 / total) * total = 5000
        // But it's safer to sum them up or use your 'Mastery' constant
        setTotalPotentialXp(5000);
      } catch (err) {
        console.error("Profile sync failed");
      }
    };
    fetchProfileData();
  }, []);

  if (!userData)
    return <div className="p-10 font-black">SYNCING_PROFILE...</div>;

  return (
    <div className="p-8 bg-[#FFFBEB] min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-[32px] p-10 shadow-[12px_12px_0px_0px_black]">
        {/* --- XP HUD --- */}
        <div className="mb-8">
          <p className="text-xs font-[900] uppercase tracking-widest text-slate-400 mb-2">
            Progress_Status
          </p>
          <div className="flex items-baseline gap-2">
            {/* LEFT SIDE: User's XP / RIGHT SIDE: Full XP */}
            <span className="text-6xl font-black italic tracking-tighter">
              {userData.xp}
            </span>
            <span className="text-2xl font-black text-slate-300">
              / {totalPotentialXp} XP
            </span>
          </div>

          {/* VISUAL PROGRESS BAR */}
          <div className="w-full h-6 bg-slate-100 border-4 border-black rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-green-400 border-r-4 border-black transition-all duration-1000"
              style={{ width: `${(userData.xp / totalPotentialXp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* --- RANK & STATS --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_black]">
            <p className="text-[10px] font-black uppercase">Current_Rank</p>
            <p className="text-2xl font-black italic">LEVEL_{userData.level}</p>
          </div>
          <div className="bg-pink-100 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_black]">
            <p className="text-[10px] font-black uppercase">Nodes_Mastered</p>
            <p className="text-2xl font-black italic">
              {userData.completedSkills?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
