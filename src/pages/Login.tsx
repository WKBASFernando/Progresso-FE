import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { apiRequest } from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // --- GOOGLE LOGIN HANDLER ---
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await apiRequest("/api/progresso/auth/google", "POST", {
          token: tokenResponse.access_token,
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/app");
      } catch (err) {
        alert("Google Sync Failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => alert("Google Popup Blocked"),
  });

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("/auth/login", "POST", formData);
      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/app");
    } catch (err: any) {
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-6 font-sans text-black relative overflow-hidden">
      {/* --- MOVING DOTS BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
        {/* Animated Floating Dots */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-black opacity-10 animate-pulse"
            style={{
              width: Math.random() * 10 + 5 + "px",
              height: Math.random() * 10 + 5 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 10 + 5 + "s",
            }}
          />
        ))}
      </div>

      {/* --- FLOATING DECORATIONS --- */}
      <div className="absolute top-10 left-10 text-6xl font-black text-blue-200 opacity-40 select-none animate-bounce">
        {"{ }"}
      </div>
      <div
        className="absolute bottom-20 right-10 text-7xl font-black text-pink-200 opacity-30 select-none animate-spin"
        style={{ animationDuration: "10s" }}
      >
        {"( )"}
      </div>

      {/* --- LOGIN CARD --- */}
      <div className="w-full max-w-md bg-white border-[4px] border-black rounded-[32px] shadow-[12px_12px_0px_0px_black] p-10 z-10">
        <header className="mb-10">
          <h1 className="text-5xl font-[900] uppercase italic tracking-tighter leading-none">
            Login
          </h1>
          <div className="h-2 w-20 bg-blue-400 mt-2 border-[2px] border-black rounded-full"></div>
        </header>

        {/* CUTE GOOGLE BUTTON */}
        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="w-full py-4 mb-8 bg-white border-[4px] border-black rounded-2xl flex items-center justify-center gap-4 font-[900] uppercase shadow-[6px_6px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all active:scale-95 group"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            className="group-hover:rotate-12 transition-transform duration-300"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          <span className="tracking-tight">Sync Google Identity</span>
        </button>

        {/* MANUAL FORM */}
        <form onSubmit={handleManualLogin} className="space-y-6">
          <input
            type="email"
            placeholder="PLAYER_EMAIL"
            className="w-full p-4 border-[3px] border-black rounded-2xl font-black bg-gray-50 outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#60A5FA] transition-all"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="SECRET_KEY"
            className="w-full p-4 border-[3px] border-black rounded-2xl font-black bg-gray-50 outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#F472B6] transition-all"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#4ADE80] border-[4px] border-black rounded-2xl font-[900] text-xl uppercase shadow-[6px_6px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all active:bg-[#22C55E]"
          >
            {loading ? "SYNCING..." : "Enter_Matrix"}
          </button>
        </form>

        <p className="text-center mt-8 font-black text-xs uppercase tracking-widest">
          New Player?{" "}
          <Link
            to="/signup"
            className="text-blue-500 underline decoration-[3px] underline-offset-4"
          >
            Create_Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
