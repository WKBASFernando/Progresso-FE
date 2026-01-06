import React from "react";
import { Link } from "react-router-dom";

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen font-sans overflow-hidden relative flex items-center justify-center p-4 bg-yellow-50">
      {/* --- CODING BACKGROUND ANIMATIONS --- */}

      {/* 1. Console Log (Top Left) */}
      <div className="absolute top-10 left-10 text-4xl font-mono font-black text-gray-300 opacity-40 animate-float-slow select-none -rotate-6">
        console.log("Hero");
      </div>

      {/* 2. Import Statement (Bottom Right) */}
      <div className="absolute bottom-20 right-10 text-5xl font-mono font-black text-blue-200 opacity-40 animate-bounce-gentle select-none rotate-12">
        import React
      </div>

      {/* 3. Infinite Loop (Middle Left) */}
      <div className="absolute top-1/2 left-5 text-3xl font-mono font-black text-purple-200 opacity-30 animate-spin-slow select-none -rotate-45">
        while(alive) {"{ code() }"}
      </div>

      {/* 4. Giant Brackets (Top Right) */}
      <div className="absolute top-20 right-20 text-8xl font-black text-green-100 opacity-50 animate-pulse select-none z-0 pointer-events-none">
        {"{ }"}
      </div>

      {/* 5. The Funny Comment (Bottom Left - Wiggling) */}
      <div
        className="absolute bottom-10 left-1/3 text-4xl font-mono font-black text-red-200 opacity-50 animate-wiggle select-none cursor-help"
        title="Fix this later!"
      >
        // TODO: Sleep
      </div>

      {/* --- CHARACTER SHEET CARD --- */}
      <div className="bg-white w-full max-w-4xl rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden flex flex-col md:flex-row">
        {/* LEFT COLUMN: Avatar & Identity */}
        <div className="bg-blue-50 p-8 md:w-1/3 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col items-center text-center">
          {/* Avatar Image */}
          <div className="w-40 h-40 bg-white rounded-full border-4 border-black mb-6 overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group cursor-pointer">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Angelo"
              alt="Player Avatar"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center text-white font-bold backdrop-blur-sm">
              Edit
            </div>
          </div>

          <h2 className="text-3xl font-black mb-1">Angelo</h2>
          <span className="px-3 py-1 bg-black text-white font-mono font-bold rounded-md text-sm mb-6 border-2 border-transparent hover:border-green-400 transition">
            &lt;FullStackDev /&gt;
          </span>

          {/* XP Bar */}
          <div className="w-full mb-2 flex justify-between text-xs font-bold font-mono">
            <span>XP++</span>
            <span>450 / 1000</span>
          </div>
          <div className="w-full h-6 bg-gray-200 border-3 border-black rounded-lg overflow-hidden mb-8 relative">
            <div className="h-full bg-green-400 w-[45%] border-r-3 border-black relative">
              {/* Shiny effect on bar */}
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/30"></div>
            </div>
          </div>

          <Link
            to="/app"
            className="w-full py-4 bg-yellow-300 border-3 border-black font-black rounded-xl hover:bg-yellow-400 shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition mb-4 flex items-center justify-center gap-2 group"
          >
            <span>▶</span> RESUME GAME
          </Link>

          <Link
            to="/"
            className="text-red-500 font-bold hover:text-red-600 font-mono text-sm"
          >
            System.exit(0); {/* Funny logout text */}
          </Link>
        </div>

        {/* RIGHT COLUMN: Stats & Achievements */}
        <div className="p-8 md:w-2/3 bg-white">
          <h3 className="text-2xl font-black mb-6 border-b-4 border-black inline-block pb-1">
            Player Stats {"{ }"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Stat 1 */}
            <div className="bg-gray-50 p-4 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-blue-50 transition">
              <div className="text-gray-500 font-bold text-xs uppercase font-mono mb-1">
                const skills =
              </div>
              <div className="text-4xl font-black text-blue-600">12;</div>
            </div>
            {/* Stat 2 */}
            <div className="bg-gray-50 p-4 rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:bg-pink-50 transition">
              <div className="text-gray-500 font-bold text-xs uppercase font-mono mb-1">
                let dayStreak =
              </div>
              <div className="text-4xl font-black text-pink-500">5;</div>
            </div>
          </div>

          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            Inventory{" "}
            <span className="text-sm bg-gray-200 px-2 rounded-full border border-black">
              Badges
            </span>
          </h3>

          <div className="flex gap-4 flex-wrap">
            {/* Badge 1 */}
            <div className="group relative">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl border-3 border-black flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_black] group-hover:-translate-y-1 transition cursor-help">
                <span className="text-3xl mb-1">🧱</span>
                <span className="text-[10px] font-bold font-mono">HTML</span>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="group relative">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl border-3 border-black flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_black] group-hover:-translate-y-1 transition cursor-help">
                <span className="text-3xl mb-1">🎨</span>
                <span className="text-[10px] font-bold font-mono">CSS</span>
              </div>
            </div>

            {/* Badge 3 (Locked) */}
            <div className="group relative opacity-50 grayscale">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl border-3 border-dashed border-gray-400 flex flex-col items-center justify-center">
                <span className="text-3xl mb-1">🔒</span>
                <span className="text-[10px] font-bold font-mono">JS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
