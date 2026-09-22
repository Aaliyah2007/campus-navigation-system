import React from 'react';
import {
  Compass,
  GraduationCap,
  BookOpenCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface CampusHeaderProps {
  onOpenVivaModal: () => void;
  onResetAll: () => void;
}

export const CampusHeader: React.FC<CampusHeaderProps> = ({
  onOpenVivaModal,
  onResetAll,
}) => {
  return (
    <header
      id="campus-navigation-header"
      className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            id="app-logo-badge"
            className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20"
          >
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                id="main-app-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-slate-900"
              >
                Smart Campus Navigation System
              </h1>
              <span
                id="project-badge"
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                College Mini Project
              </span>
            </div>
            <p
              id="main-app-subtitle"
              className="text-xs sm:text-sm text-slate-500 font-normal"
            >
              Graph-Based Campus Navigation using BFS, DFS & Shortest Path
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="viva-guide-btn"
            onClick={onOpenVivaModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
            title="Open DSA viva preparation cheat sheet and algorithm theory"
          >
            <BookOpenCheck className="w-4 h-4 text-emerald-600" />
            <span>Viva / DSA Theory</span>
          </button>

          <button
            id="header-reset-btn"
            onClick={onResetAll}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            title="Reset campus graph and selections"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
