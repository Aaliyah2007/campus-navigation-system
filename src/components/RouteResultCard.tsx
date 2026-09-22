import React from 'react';
import {
  CampusNodeId,
  AlgorithmType,
} from '../types';
import {
  CAMPUS_NODES,
  getEdgeBetween,
} from '../data/campusGraph';
import {
  CheckCircle2,
  AlertTriangle,
  Route,
  ArrowRight,
  Footprints,
  Clock,
  Compass,
} from 'lucide-react';

interface RouteResultCardProps {
  algorithm: AlgorithmType;
  pathFound: boolean;
  path: CampusNodeId[];
  totalDistance: number;
  nodesVisitedCount: number;
  startNodeId: CampusNodeId;
  destinationNodeId: CampusNodeId;
  executionTimeMs?: number;
}

export const RouteResultCard: React.FC<RouteResultCardProps> = ({
  algorithm,
  pathFound,
  path,
  totalDistance,
  nodesVisitedCount,
  startNodeId,
  destinationNodeId,
  executionTimeMs = 0,
}) => {
  if (path.length === 0 && !pathFound) {
    return null;
  }

  const startNode = CAMPUS_NODES[startNodeId];
  const destNode = CAMPUS_NODES[destinationNodeId];

  return (
    <div
      id="route-result-summary-card"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4"
    >
      {/* Route Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          {pathFound ? (
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {pathFound ? 'Campus Route Discovered' : 'No Route Found'}
            </h3>
            <p className="text-xs text-slate-500">
              Navigating from {startNode.name} to {destNode.name}
            </p>
          </div>
        </div>

        {/* Algorithm Badge & Metric Chips */}
        <div className="flex items-center gap-2">
          {pathFound && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Route className="w-4 h-4 text-emerald-600" />
              <span>{totalDistance} meters</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
            <Footprints className="w-3.5 h-3.5 text-slate-500" />
            <span>{nodesVisitedCount} explored</span>
          </div>
          {executionTimeMs > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-50 text-slate-500 text-xs font-mono">
              <Clock className="w-3 h-3" />
              <span>{executionTimeMs}ms</span>
            </div>
          )}
        </div>
      </div>

      {pathFound ? (
        <div>
          {/* Ordered Route Breadcrumbs */}
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Ordered Campus Pathway ({path.length} landmarks, {path.length - 1} road segments)
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1">
              {path.map((nodeId, idx) => {
                const node = CAMPUS_NODES[nodeId];
                const isStart = idx === 0;
                const isDest = idx === path.length - 1;

                // Lookup distance to next node
                let nextDistance: number | null = null;
                if (idx < path.length - 1) {
                  const edge = getEdgeBetween(nodeId, path[idx + 1]);
                  if (edge) nextDistance = edge.distance;
                }

                return (
                  <React.Fragment key={`path-seq-${nodeId}-${idx}`}>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 shadow-2xs border ${
                        isStart
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : isDest
                          ? 'bg-rose-600 text-white border-rose-700'
                          : 'bg-white text-slate-800 border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] opacity-75 font-mono">
                        {idx + 1}.
                      </span>
                      <span>{node.shortName}</span>
                    </div>

                    {nextDistance !== null && (
                      <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 px-1 shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {nextDistance}m
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Turn-by-Turn Wayfinding Details */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 font-semibold text-slate-700">
              Turn-by-Turn Wayfinding Directions
            </div>
            <div className="divide-y divide-slate-100">
              {path.slice(0, -1).map((nodeId, idx) => {
                const fromNode = CAMPUS_NODES[nodeId];
                const toNode = CAMPUS_NODES[path[idx + 1]];
                const edge = getEdgeBetween(nodeId, path[idx + 1]);

                return (
                  <div
                    key={`step-turn-${idx}`}
                    className="px-3.5 py-2 flex items-center justify-between hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800">
                        From <span className="font-semibold">{fromNode.name}</span>{' '}
                        follow {edge?.pathType === 'walkway' ? 'walkway' : 'campus road'} to{' '}
                        <span className="font-semibold text-blue-700">{toNode.name}</span>
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {edge?.distance || 0} m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Algorithm-Specific Note */}
          <div className="mt-3 text-[11px] text-slate-500 italic">
            {algorithm === 'dijkstra' ? (
              <span>
                ✓ Verified via Dijkstra's algorithm: guarantees absolute minimal
                walking distance on weighted edges.
              </span>
            ) : algorithm === 'bfs' ? (
              <span>
                ℹ BFS calculates minimum edge hops (fewest road segments), but
                does not account for road meter distances.
              </span>
            ) : (
              <span>
                ℹ DFS prioritizes deep branch traversal; route may be significantly
                longer than optimal.
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
          No connecting road or walkway was found between {startNode.name} and{' '}
          {destNode.name}.
        </div>
      )}
    </div>
  );
};
