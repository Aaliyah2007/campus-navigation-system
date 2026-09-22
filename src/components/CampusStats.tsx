import React from 'react';
import {
  MapPin,
  GitBranch,
  Ruler,
  Cpu,
  Footprints,
  Route,
} from 'lucide-react';
import { AlgorithmType } from '../types';

interface CampusStatsProps {
  totalLocations: number;
  totalConnections: number;
  totalNetworkDistance: number;
  selectedAlgorithm: AlgorithmType;
  nodesVisitedCount: number;
  pathDistance: number | null;
}

export const CampusStats: React.FC<CampusStatsProps> = ({
  totalLocations,
  totalConnections,
  totalNetworkDistance,
  selectedAlgorithm,
  nodesVisitedCount,
  pathDistance,
}) => {
  const algoLabels: Record<AlgorithmType, { name: string; badgeColor: string }> = {
    bfs: { name: 'BFS (Fewest Hops)', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    dfs: { name: 'DFS (Backtracking)', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
    dijkstra: { name: "Dijkstra (Shortest Dist)", badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  return (
    <div
      id="campus-stats-dashboard"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4"
    >
      {/* 1. Total Locations */}
      <div
        id="stat-card-locations"
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Locations
          </div>
          <div className="text-lg font-bold text-slate-900 leading-tight">
            {totalLocations}
          </div>
          <div className="text-[10px] text-slate-400">Campus Vertices |V|</div>
        </div>
      </div>

      {/* 2. Total Connections */}
      <div
        id="stat-card-connections"
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
          <GitBranch className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Roadways
          </div>
          <div className="text-lg font-bold text-slate-900 leading-tight">
            {totalConnections}
          </div>
          <div className="text-[10px] text-slate-400">Graph Edges |E|</div>
        </div>
      </div>

      {/* 3. Total Network Distance */}
      <div
        id="stat-card-total-distance"
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Ruler className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Total Grid
          </div>
          <div className="text-lg font-bold text-slate-900 leading-tight">
            {totalNetworkDistance}
            <span className="text-xs font-normal text-slate-500 ml-0.5">m</span>
          </div>
          <div className="text-[10px] text-slate-400">All Road Weights</div>
        </div>
      </div>

      {/* 4. Algorithm in Use */}
      <div
        id="stat-card-algorithm"
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Algorithm
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {algoLabels[selectedAlgorithm].name.split(' ')[0]}
          </div>
          <span
            className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium border truncate max-w-full ${algoLabels[selectedAlgorithm].badgeColor}`}
          >
            {selectedAlgorithm.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 5. Nodes Visited */}
      <div
        id="stat-card-nodes-visited"
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <Footprints className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Explored
          </div>
          <div className="text-lg font-bold text-slate-900 leading-tight">
            {nodesVisitedCount}
            <span className="text-xs font-normal text-slate-500">
              /{totalLocations}
            </span>
          </div>
          <div className="text-[10px] text-slate-400">Nodes Examined</div>
        </div>
      </div>

      {/* 6. Route Distance */}
      <div
        id="stat-card-route-distance"
        className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5"
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Route className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Route Dist
          </div>
          <div className="text-lg font-bold text-emerald-700 leading-tight">
            {pathDistance !== null && pathDistance > 0 ? (
              <>
                {pathDistance}
                <span className="text-xs font-normal text-emerald-600 ml-0.5">m</span>
              </>
            ) : (
              <span className="text-slate-400 text-sm font-normal">--</span>
            )}
          </div>
          <div className="text-[10px] text-slate-400">Target Path</div>
        </div>
      </div>
    </div>
  );
};
