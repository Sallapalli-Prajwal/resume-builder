import React from "react";
import BulletRewriteBox from "./BulletRewriteBox";
import SummaryGenerator from "./SummaryGenerator";
import SkillSuggestions from "./SkillSuggestions";

const AIAssistantPanel = () => {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100/70 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">
            AI Resume Assistant
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl">
            Improve bullets, generate summaries, and discover missing skills
            tailored to your target role. All suggestions are optimized for ATS
            parsing.
          </p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <BulletRewriteBox />
          <SummaryGenerator />
        </div>
        <div className="space-y-4">
          <SkillSuggestions />
        </div>
      </div>
    </section>
  );
};

export default AIAssistantPanel;

