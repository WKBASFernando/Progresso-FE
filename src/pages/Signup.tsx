import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- HANDLER ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Updated path to include the /api/progresso prefix
      const result = await apiRequest("/api/progresso/auth/register", "POST", {
        ...formData,
        role: "USER", // Explicitly setting it to USER for the API call
      });

      if (result.message.toLowerCase().includes("successfully")) {
        alert("Registration Successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (err: any) {
      setError(err.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative font-sans bg-slate-50">
      {/* --- BACKGROUND ANIMATIONS --- */}
      <div className="absolute top-10 left-5 text-4xl font-mono font-black text-gray-400 opacity-20 animate-float-slow select-none -rotate-6">
        $ git init
      </div>
      <div className="absolute bottom-10 right-5 text-4xl font-mono font-black text-blue-400 opacity-20 animate-bounce-gentle select-none rotate-3">
        npm install
      </div>
      <div className="absolute top-20 right-20 text-8xl font-black text-purple-400 opacity-10 animate-spin-slow select-none pointer-events-none">
        {"{}"}
      </div>
      <div className="absolute bottom-1/3 left-10 text-6xl opacity-30 animate-wiggle select-none cursor-help">
        🌱
      </div>

      {/* --- SIGNUP CARD --- */}
      <div className="bg-white w-full max-w-lg p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-gentle">🛡️</div>
          <h1 className="text-4xl font-black mb-2 italic">New Player?</h1>
          <p className="text-gray-500 font-bold font-mono text-sm">
            User.create(new_identity);
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold rounded-xl animate-wiggle">
            ⚠ ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-black ml-1 flex items-center gap-2 text-slate-700">
                First Name{" "}
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded border border-blue-300 font-mono">
                  Str
                </span>
              </label>
              <input
                name="firstname"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-3 border-black bg-gray-50 focus:bg-blue-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="font-black ml-1 flex items-center gap-2 text-slate-700">
                Last Name{" "}
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded border border-blue-300 font-mono">
                  Str
                </span>
              </label>
              <input
                name="lastname"
                required
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-3 border-black bg-gray-50 focus:bg-blue-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-black ml-1 flex items-center gap-2 text-slate-700">
              Email{" "}
              <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded border border-yellow-300 font-mono">
                Email
              </span>
            </label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              placeholder="player@matrix.com"
              className="w-full px-4 py-3 rounded-xl border-3 border-black bg-gray-50 focus:bg-yellow-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="font-black ml-1 flex items-center gap-2 text-slate-700">
              Password{" "}
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-300 font-mono">
                Secret
              </span>
            </label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border-3 border-black bg-gray-50 focus:bg-pink-50 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-blue-500 hover:bg-blue-400 text-white text-xl font-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2 mt-4 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "INITIALIZING..." : "CONFIRM IDENTITY"}
          </button>
        </form>

        <div className="mt-8 text-center font-mono text-sm">
          <p className="font-bold text-gray-400">
            // Identity already exists?
            <br />
            <Link
              to="/login"
              className="text-blue-600 font-black hover:underline decoration-wavy"
            >
              return to_login();
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
