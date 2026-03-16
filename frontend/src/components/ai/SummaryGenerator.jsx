import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SummaryGenerator = ({ initialTargetRole = "Software Engineer" }) => {
  const [experiences, setExperiences] = useState("");
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const handleGenerate = async () => {
    setError("");
    setSummary("");

    if (!experiences.trim() || !skills.trim()) {
      setError("Please provide both experience and key skills.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_SUMMARY,
        {
          experiences,
          skills,
          targetRole,
        }
      );

      setSummary(response.data?.summary || "");
    } catch (err) {
      console.error("AI summary generation failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate summary. Please try again."
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
            AI Resume Summary Generator
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
            Generate a concise, role-aligned professional summary for the top of
            your resume.
          </p>
        </div>
        <input
          type="text"
          className="border border-slate-200 rounded-md px-2 py-1 text-[11px] sm:text-xs w-28 sm:w-40 bg-white shadow-xs"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="Target role"
        />
      </div>

      <textarea
        className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400/60 rounded-lg px-3 py-2 text-sm resize-y min-h-[70px] bg-white"
        placeholder="Summarize your past experience, roles, and impact..."
        value={experiences}
        onChange={(e) => setExperiences(e.target.value)}
      />

      <textarea
        className="w-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400/60 rounded-lg px-3 py-2 text-sm resize-y min-h-[55px] bg-white"
        placeholder="List your key skills (comma-separated)..."
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}

      {summary && (
        <div className="mt-2 text-xs sm:text-sm text-slate-800">
          <p className="font-semibold mb-1">Generated summary:</p>
          <p className="text-gray-800 whitespace-pre-line">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryGenerator;

