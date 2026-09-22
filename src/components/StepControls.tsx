import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  FastForward,
  Gauge,
} from 'lucide-react';
import { AlgorithmStep } from '../types';

interface StepControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // in milliseconds
  currentStepData?: AlgorithmStep;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (index: number) => void;
  onReset: () => void;
  onChangeSpeed: (speedMs: number) => void;
}

export const StepControls: React.FC<StepControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  currentStepData,
  onPlay,
  onPause,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onReset,
  onChangeSpeed,
}) => {
  if (totalSteps <= 0) return null;

  const progressPercent =
    totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 100;

  const speedOptions = [
    { label: '0.5x', ms: 1400 },
    { label: '1.0x', ms: 800 },
    { label: '2.0x', ms: 400 },
    { label: '4.0x', ms: 180 },
  ];

  const getActionBadgeColor = (action?: string) => {
    switch (action) {
      case 'INIT':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'DEQUEUE':
      case 'POP_STACK':
      case 'SELECT_NODE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'EXPLORE_NEIGHBOR':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'RELAX_EDGE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'DESTINATION_REACHED':
      case 'PATH_RECONSTRUCTED':
        return 'bg-green-600 text-white border-green-700';
      case 'SKIP_VISITED':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div
      id="step-by-step-controls-panel"
      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4"
    >
      {/* Top row: Step Counter & Action Type Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          {currentStepData && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getActionBadgeColor(
                currentStepData.action
              )}`}
            >
              {currentStepData.action.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-xs">
          <Gauge className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <span className="text-slate-500 font-medium mr-1 hidden sm:inline">Speed:</span>
          {speedOptions.map((opt) => (
            <button
              key={opt.label}
              id={`speed-btn-${opt.label}`}
              onClick={() => onChangeSpeed(opt.ms)}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                playbackSpeed === opt.ms
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar / Interactive Scrubber */}
      <div className="mb-3.5">
        <input
          id="step-scrubber-slider"
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>Start (Step 1)</span>
          <span>{Math.round(progressPercent)}% Explored</span>
          <span>End (Step {totalSteps})</span>
        </div>
      </div>

      {/* Playback Button Group */}
      <div className="flex items-center justify-center gap-2">
        {/* Jump to Beginning */}
        <button
          id="step-beginning-btn"
          onClick={() => onJumpToStep(0)}
          disabled={currentStepIndex === 0}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-slate-200 transition-colors cursor-pointer"
          title="Jump to Start"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Previous Step */}
        <button
          id="step-prev-btn"
          onClick={onPrevStep}
          disabled={currentStepIndex === 0}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-slate-200 transition-colors cursor-pointer"
          title="Previous Step"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Play / Pause Primary Button */}
        <button
          id="step-play-pause-btn"
          onClick={isPlaying ? onPause : onPlay}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all cursor-pointer ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>{currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
            </>
          )}
        </button>

        {/* Next Step */}
        <button
          id="step-next-btn"
          onClick={onNextStep}
          disabled={currentStepIndex >= totalSteps - 1}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-slate-200 transition-colors cursor-pointer"
          title="Next Step"
        >
          <span className="hidden sm:inline">Next</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Jump to End */}
        <button
          id="step-end-btn"
          onClick={() => onJumpToStep(totalSteps - 1)}
          disabled={currentStepIndex >= totalSteps - 1}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-slate-200 transition-colors cursor-pointer"
          title="Jump to Final Step"
        >
          <FastForward className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-slate-200 mx-1" />

        {/* Reset */}
        <button
          id="step-reset-btn"
          onClick={onReset}
          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
          title="Reset Visualization"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
