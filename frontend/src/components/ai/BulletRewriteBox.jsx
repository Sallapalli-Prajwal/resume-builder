import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const TARGET_ROLES = [
  "Software Engineer",
  "Full-Stack Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "ML Engineer",
  "Data Scientist",
  "Data Engineer",
  "DevOps Engineer",
  "Product Manager",
];

const BulletRewriteBox = () => {
  const [bullet, setBullet] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleImprove = async () => {
    setError("");
    setResult(null);

    if (!bullet.trim()) {
      setError("Please enter a bullet point.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(API_PATHS.AI.REWRITE_BULLET, {
        bullet,
        targetRole,
      });
      setResult(response.data);
    } catch (err) {
      console.error("AI bullet rewrite failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to improve bullet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/90 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-900">
            AI Bullet Point Improvement
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
            Turn short phrases into impact-focused, achievement-oriented bullets.
          </p>
        </div>
        <select
          className="border border-slate-200 rounded-md px-2 py-1 text-[11px] sm:text-xs bg-white shadow-xs"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        >
          {TARGET_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400/60 rounded-lg px-3 py-2 text-sm resize-y min-h-[70px] bg-white"
        placeholder='Example: "Built a trading bot"'
        value={bullet}
        onChange={(e) => setBullet(e.target.value)}
      />

      <button
        type="button"
        onClick={handleImprove}
        disabled={loading}
        className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Improving..." : "Improve with AI"}
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-2 space-y-2 text-xs sm:text-sm text-slate-800">
          <div>
            <p className="font-semibold">Improved bullet:</p>
            <p className="text-gray-800 mt-0.5">{result.improvedBullet}</p>
          </div>
          <div>
            <p className="font-semibold">ATS-optimized version:</p>
            <p className="text-gray-800 mt-0.5">{result.atsVersion}</p>
          </div>
          {Array.isArray(result.keywordsAdded) &&
            result.keywordsAdded.length > 0 && (
              <div>
                <p className="font-semibold">Keywords added:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.keywordsAdded.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default BulletRewriteBox;

