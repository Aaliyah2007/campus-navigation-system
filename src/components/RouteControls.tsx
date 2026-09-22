import React from 'react';
import {
  CampusNodeId,
  AlgorithmType,
} from '../types';
import {
  CAMPUS_NODES,
  ALGORITHM_METADATA,
} from '../data/campusGraph';
import {
  ArrowRightLeft,
  Navigation2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  Database,
  CheckCircle2,
} from 'lucide-react';

interface RouteControlsProps {
  startNodeId: CampusNodeId;
  destinationNodeId: CampusNodeId;
  selectedAlgorithm: AlgorithmType;
  onChangeStart: (id: CampusNodeId) => void;
  onChangeDestination: (id: CampusNodeId) => void;
  onSwapLocations: () => void;
  onChangeAlgorithm: (algo: AlgorithmType) => void;
  onRunInstant: () => void;
  onStartVisualization: () => void;
  onReset: () => void;
  isVisualizing: boolean;
}

export const RouteControls: React.FC<RouteControlsProps> = ({
  startNodeId,
  destinationNodeId,
  selectedAlgorithm,
  onChangeStart,
  onChangeDestination,
  onSwapLocations,
  onChangeAlgorithm,
  onRunInstant,
  onStartVisualization,
  onReset,
  isVisualizing,
}) => {
  const nodeList = Object.values(CAMPUS_NODES);

  // Quick preset shortcuts for viva demonstration
  const presets: Array<{ name: string; start: CampusNodeId; dest: CampusNodeId }> = [
    { name: 'Gate ➔ Library', start: 'main_gate', dest: 'library' },
    { name: 'Gate ➔ Auditorium', start: 'main_gate', dest: 'auditorium' },
    { name: 'Hostel ➔ Sports Ground', start: 'hostel', dest: 'sports_ground' },
    { name: 'Parking ➔ CSE Block', start: 'parking_area', dest: 'cse_block' },
  ];

  return (
    <div
      id="route-controls-card"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4"
    >
      {/* Location Dropdowns & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center mb-4">
        {/* Start Location Dropdown */}
        <div className="lg:col-span-5">
          <label
            htmlFor="start-location-select"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 inline-block" />
            Start Location
          </label>
          <div className="relative">
            <select
              id="start-location-select"
              value={startNodeId}
              onChange={(e) => onChangeStart(e.target.value as CampusNodeId)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-medium text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3.5 py-2.5 transition-all outline-none cursor-pointer"
            >
              {nodeList.map((node) => (
                <option key={`start-${node.id}`} value={node.id}>
                  {node.name} ({node.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-2 flex justify-center">
          <button
            id="swap-locations-btn"
            type="button"
            onClick={onSwapLocations}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 hover:border-blue-200 transition-all cursor-pointer shadow-2xs"
            title="Swap Start and Destination"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Dropdown */}
        <div className="lg:col-span-5">
          <label
            htmlFor="destination-location-select"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100 inline-block" />
            Destination
          </label>
          <div className="relative">
            <select
              id="destination-location-select"
              value={destinationNodeId}
              onChange={(e) => onChangeDestination(e.target.value as CampusNodeId)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-medium text-sm rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 px-3.5 py-2.5 transition-all outline-none cursor-pointer"
            >
              {nodeList.map((node) => (
                <option key={`dest-${node.id}`} value={node.id}>
                  {node.name} ({node.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Demo Presets */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Demo Routes:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.name}
            id={`preset-btn-${preset.start}-${preset.dest}`}
            onClick={() => {
              onChangeStart(preset.start);
              onChangeDestination(preset.dest);
            }}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              startNodeId === preset.start && destinationNodeId === preset.dest
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Algorithm Selection Cards (BFS, DFS, Dijkstra) */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          Select Graph Algorithm
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* BFS Card */}
          <div
            id="algo-card-bfs"
            onClick={() => onChangeAlgorithm('bfs')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
              selectedAlgorithm === 'bfs'
                ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-900 tracking-wide">
                Breadth-First Search (BFS)
              </span>
              {selectedAlgorithm === 'bfs' && (
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
              Explores level-by-level. Optimal for unweighted fewest road hops.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                <Database className="w-2.5 h-2.5 text-blue-500" /> Queue (FIFO)
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                <Clock className="w-2.5 h-2.5 text-blue-500" /> O(V + E)
              </span>
            </div>
          </div>

          {/* DFS Card */}
          <div
            id="algo-card-dfs"
            onClick={() => onChangeAlgorithm('dfs')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
              selectedAlgorithm === 'dfs'
                ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-purple-900 tracking-wide">
                Depth-First Search (DFS)
              </span>
              {selectedAlgorithm === 'dfs' && (
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
              Dives deep along branches before backtracking. Used in connectivity.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                <Database className="w-2.5 h-2.5 text-purple-500" /> Stack (LIFO)
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                <Clock className="w-2.5 h-2.5 text-purple-500" /> O(V + E)
              </span>
            </div>
          </div>

          {/* Dijkstra Card */}
          <div
            id="algo-card-dijkstra"
            onClick={() => onChangeAlgorithm('dijkstra')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
              selectedAlgorithm === 'dijkstra'
                ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-900 tracking-wide">
                Dijkstra Shortest Path
              </span>
              {selectedAlgorithm === 'dijkstra' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
              Greedy edge relaxation. Finds guaranteed minimum distance in meters.
            </p>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                <Database className="w-2.5 h-2.5 text-emerald-500" /> Priority Queue
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono">
                <Clock className="w-2.5 h-2.5 text-emerald-500" /> O((V+E)log V)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Execution Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
        <button
          id="find-route-btn"
          type="button"
          onClick={onRunInstant}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
        >
          <Navigation2 className="w-4 h-4" />
          <span>Find Route (Instant)</span>
        </button>

        <button
          id="visualize-step-by-step-btn"
          type="button"
          onClick={onStartVisualization}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Visualize Step by Step</span>
        </button>

        <button
          id="reset-selection-btn"
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm border border-slate-200 transition-colors cursor-pointer"
          title="Reset graph state and clear route"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Clear / Reset</span>
        </button>
      </div>
    </div>
  );
};
