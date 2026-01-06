import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative font-sans bg-yellow-50">
      {/* --- CODING BACKGROUND ANIMATIONS --- */}

      {/* 1. The Git Command (Top Left) */}
      <div className="absolute top-10 left-5 text-4xl font-mono font-black text-gray-300 opacity-40 animate-float-slow select-none -rotate-6">
        $ git push --force
      </div>

      {/* 2. The NPM Command (Bottom Right) */}
      <div className="absolute bottom-10 right-5 text-4xl font-mono font-black text-red-200 opacity-50 animate-bounce-gentle select-none rotate-3">
        npm run dev
      </div>

      {/* 3. The 404 Error (Top Right, Spinning) */}
      <div className="absolute top-20 right-20 text-8xl font-black text-purple-200 opacity-30 animate-spin-slow select-none pointer-events-none">
        404
      </div>

      {/* 4. The "Bug" (Middle Left, Wiggling) */}
      <div
        className="absolute bottom-1/3 left-10 text-6xl opacity-60 animate-wiggle select-none cursor-help"
        title="It's not a bug, it's a feature!"
      >
        🐛
      </div>

      {/* 5. Binary Code (Center Background) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-blue-100 opacity-20 animate-pulse select-none pointer-events-none z-0">
        0101
      </div>

      {/* 6. Sudo Command (Bottom Left) */}
      <div className="absolute bottom-32 left-20 text-5xl font-mono font-black text-green-200 opacity-40 animate-float-medium select-none rotate-12">
        sudo
      </div>

      {/* --- LOGIN CARD --- */}
      <div className="bg-white w-full max-w-md p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-gentle">👋</div>
          <h1 className="text-4xl font-black mb-2">Player 1 Ready?</h1>
          <p className="text-gray-600 font-bold font-mono">
            System.out.println("Welcome");
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="font-black ml-1 flex items-center gap-2">
              Email{" "}
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded border border-blue-300 font-mono">
                String
              </span>
            </label>
            <input
              type="email"
              placeholder="dev@progresso.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-3 border-black bg-gray-50 focus:bg-blue-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="font-black ml-1 flex items-center gap-2">
              Password{" "}
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-300 font-mono">
                Hash
              </span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-3 border-black bg-gray-50 focus:bg-pink-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-400 hover:bg-green-300 text-black text-xl font-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none transition-all flex justify-center items-center gap-2 group"
          >
            <span className="group-hover:animate-wiggle">🚀</span> EXECUTE LOGIN
          </button>
        </form>

        <div className="mt-8 text-center font-mono text-sm">
          <p className="font-bold text-gray-500">
            // No account?
            <br />
            <Link
              to="/signup"
              className="text-blue-600 hover:underline decoration-wavy decoration-2 font-black text-base"
            >
              const user = new Player();
            </Link>
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="text-xs font-bold text-gray-400 hover:text-black transition"
            >
              ← cd .. (Back to Home)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
