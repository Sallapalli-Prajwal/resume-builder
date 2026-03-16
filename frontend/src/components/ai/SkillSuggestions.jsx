import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SkillSuggestions = ({ initialTargetRole = "Software Engineer" }) => {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState([]);

  const handleSuggest = async () => {
    setError("");
    setSkills([]);

    if (!resumeText.trim()) {
      setError("Paste some resume content first.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        API_PATHS.AI.SUGGEST_SKILLS,
        {
          resumeText,
          targetRole,
        }
      );

      setSkills(response.data?.suggestedSkills || []);
    } catch (err) {
      console.error("AI skill suggestion failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to suggest skills. Please try again."
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
            AI Skill Suggestions
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-600">
            Find missing skills and technologies that recruiters expect for your
            target role.
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
        className="w-full border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-400/60 rounded-lg px-3 py-2 text-sm resize-y min-h-[70px] bg-white"
        placeholder="Paste your resume content or skills section..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSuggest}
        disabled={loading}
        className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full bg-sky-600 text-white hover:bg-sky-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing..." : "Suggest Skills"}
      </button>

      {error && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}

      {skills.length > 0 && (
        <div className="mt-2 text-xs sm:text-sm text-slate-800">
          <p className="font-semibold mb-1">Suggested skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] sm:text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSuggestions;

