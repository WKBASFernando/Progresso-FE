import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { apiRequest } from "../services/api";

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoFinished, setVideoFinished] = useState(false);

  // --- ANTI-SKIP STATE ---
  const playerRef = useRef<any>(null);
  const furthestTime = useRef(0);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await apiRequest(`/api/progresso/skill/${id}`);
        setSkill(res);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [id]);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;

    // Check every 500ms if the user skipped ahead
    setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();

        if (currentTime > furthestTime.current + 2) {
          // User skipped forward! Snap them back
          playerRef.current.seekTo(furthestTime.current);
          console.warn("Skipping forbidden in the Matrix.");
        } else {
          // User is watching normally, update the furthest point
          furthestTime.current = Math.max(furthestTime.current, currentTime);
        }
      }
    }, 500);
  };

  const onPlayerEnd = () => {
    setVideoFinished(true);
  };

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      rel: 0,
      controls: 1, // Keep controls on so they can still rewind
    },
  };

  if (loading) return <div className="p-10 font-black">SYNCING...</div>;
  if (!skill)
    return <div className="p-10 font-black text-red-600">NODE_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-yellow-50 p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-6 uppercase italic">
          {skill.title}
        </h1>

        <div className="border-4 border-black shadow-[10px_10px_0px_0px_black] rounded-2xl overflow-hidden bg-black aspect-video">
          <YouTube
            videoId={getYoutubeId(skill.videoUrl)}
            opts={opts}
            onReady={onPlayerReady}
            onEnd={onPlayerEnd}
            className="w-full h-full"
          />
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <p className="bg-white p-6 border-4 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_black]">
            {skill.description}
          </p>

          <button
            disabled={!videoFinished}
            className={`w-full py-6 border-4 border-black rounded-2xl font-black text-xl shadow-[8px_8px_0px_0px_black] transition-all 
                ${
                  videoFinished
                    ? "bg-green-400 hover:translate-y-1 hover:shadow-none"
                    : "bg-gray-200 opacity-50 cursor-not-allowed"
                }`}
          >
            {videoFinished
              ? "MARK AS COMPLETED ✅"
              : "WATCH FULL TRANSMISSION 🔒"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
