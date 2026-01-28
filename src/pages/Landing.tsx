import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen font-sans overflow-hidden selection:bg-pink-300 selection:text-black">
      {/* --- PROGRAMMING BACKGROUND PARTICLES --- */}
      <div className="absolute top-10 -left-10 text-9xl font-mono font-black text-pink-200 opacity-30 animate-float-slow z-0 select-none pointer-events-none rotate-12">
        {"<div />"}
      </div>

      <div className="absolute top-20 -right-5 text-8xl font-mono font-black text-blue-200 opacity-30 animate-float-medium z-0 select-none pointer-events-none -rotate-12">
        {"{ }"}
      </div>

      <div className="absolute bottom-40 left-10 text-7xl font-mono font-black text-green-200 opacity-30 animate-bounce-gentle z-0 select-none pointer-events-none">
        {"&&"}
      </div>

      <div className="absolute bottom-20 right-20 text-8xl font-mono font-black text-purple-200 opacity-20 animate-spin-slow z-0 select-none pointer-events-none">
        {"!="}
      </div>

      <div className="absolute top-1/2 left-1/3 text-9xl font-mono font-black text-yellow-100 opacity-40 animate-pulse z-0 select-none pointer-events-none">
        {"[ ]"}
      </div>

      {/* NAVBAR */}
      <nav className="relative flex items-center justify-between px-8 py-6 border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="text-3xl font-black tracking-wider text-black flex items-center gap-2 transform -rotate-2">
          🚀 Progresso<span className="text-purple-500">.</span>
        </div>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-black font-bold hover:underline decoration-wavy decoration-2 decoration-pink-500 text-lg"
          >
            Log In
          </Link>
          <Link
            to="/dashboard" // Updated to match your Dashboard route
            className="px-6 py-3 bg-blue-400 text-black text-lg font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all rounded-xl"
          >
            Start Playing!
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 z-10">
        <span className="px-6 py-2 bg-green-300 border-2 border-black font-bold rounded-full mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-2 animate-bounce">
          v1.0 BETA IS LIVE!
        </span>

        <h1 className="text-6xl md:text-8xl font-black text-black leading-tight mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border-2 border-transparent">
          Level Up Your <br />
          <span className="text-pink-400 text-stroke-3 drop-shadow-[4px_4px_0px_black]">
            Skills Tree!
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-800 max-w-2xl mx-auto font-medium mb-10 leading-relaxed bg-white/80 p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#ccc]">
          Don't just learn.{" "}
          <span className="bg-yellow-300 px-2 border border-black rounded transform -rotate-1 inline-block">
            Play.
          </span>{" "}
          Visualize your knowledge like a video game skill tree. Unlock nodes,
          gain XP, and master your craft.
        </p>

        <div className="flex gap-6">
          <Link
            to="/dashboard" // Updated to match your Dashboard route
            className="px-10 py-5 bg-pink-400 text-black text-xl font-bold rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-300 hover:-translate-y-1 transition-transform"
          >
            Launch Tree 🌳
          </Link>
        </div>

        {/* CARDS GRID */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-50 transition z-20 relative">
            <div className="text-5xl mb-4 transform hover:scale-110 transition">
              👀
            </div>
            <h3 className="text-2xl font-black mb-2">Visual Learning</h3>
            <p className="font-medium text-gray-700">
              No more boring lists. See your path clearly with colorful nodes.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-green-50 transition transform md:-translate-y-8 z-20 relative">
            <div className="text-5xl mb-4 transform hover:scale-110 transition">
              🎮
            </div>
            <h3 className="text-2xl font-black mb-2">Gamified XP</h3>
            <p className="font-medium text-gray-700">
              Earn XP for every skill you unlock. Can you reach Level 99?
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-50 transition z-20 relative">
            <div className="text-5xl mb-4 transform hover:scale-110 transition">
              🔒
            </div>
            <h3 className="text-2xl font-black mb-2">Unlock & Progress</h3>
            <p className="font-medium text-gray-700">
              Complete prerequisites to unlock advanced secret skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
