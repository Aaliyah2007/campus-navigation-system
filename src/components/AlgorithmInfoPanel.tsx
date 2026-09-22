import React, { useState } from 'react';
import {
  AlgorithmType,
  AlgorithmStep,
  CampusNodeId,
  DijkstraTableEntry,
} from '../types';
import {
  CAMPUS_NODES,
  ALGORITHM_METADATA,
} from '../data/campusGraph';
import {
  Database,
  Layers,
  ArrowRight,
  Code2,
  Table as TableIcon,
  CheckCircle,
  HelpCircle,
  Footprints,
  Info,
} from 'lucide-react';

interface AlgorithmInfoPanelProps {
  algorithm: AlgorithmType;
  currentStepData?: AlgorithmStep;
  startNodeId: CampusNodeId;
  destinationNodeId: CampusNodeId;
  pathFound: boolean;
  totalPathDistance: number | null;
}

export const AlgorithmInfoPanel: React.FC<AlgorithmInfoPanelProps> = ({
  algorithm,
  currentStepData,
  startNodeId,
  destinationNodeId,
  pathFound,
  totalPathDistance,
}) => {
  const [activeTab, setActiveTab] = useState<'datastructure' | 'pseudocode'>(
    'datastructure'
  );

  const meta = ALGORITHM_METADATA[algorithm];
  const currentNode = currentStepData?.currentNodeId
    ? CAMPUS_NODES[currentStepData.currentNodeId]
    : null;
  const neighborNode = currentStepData?.neighborNodeId
    ? CAMPUS_NODES[currentStepData.neighborNodeId]
    : null;

  return (
    <div
      id="algorithm-info-panel"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4"
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">{meta.name}</h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {meta.dataStructure}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{meta.tagline}</p>
        </div>

        {/* Tab switch between Live Data Structure and Pseudocode */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            id="tab-datastructure-btn"
            onClick={() => setActiveTab('datastructure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'datastructure'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {algorithm === 'dijkstra' ? (
              <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Database className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>
              {algorithm === 'dijkstra'
                ? 'Distance Table'
                : algorithm === 'bfs'
                ? 'Queue State'
                : 'Stack State'}
            </span>
          </button>

          <button
            id="tab-pseudocode-btn"
            onClick={() => setActiveTab('pseudocode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'pseudocode'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Algorithm Pseudocode</span>
          </button>
        </div>
      </div>

      {/* Current Step Plain-English Narrative Box */}
      {currentStepData && (
        <div
          id="current-step-narrative"
          className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 mb-4"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
              i
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-2">
                <span>Step {currentStepData.stepNumber}:</span>
                <span className="font-semibold text-slate-700">
                  {currentStepData.action.replace('_', ' ')}
                </span>
                {currentNode && (
                  <span className="text-[11px] font-normal text-slate-500">
                    (At: {currentNode.name})
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'datastructure' ? (
        <div>
          {/* DIJKSTRA: Interactive Distance Table */}
          {algorithm === 'dijkstra' && currentStepData?.dijkstraTable && (
            <div id="dijkstra-distance-table-container" className="overflow-x-auto">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Dijkstra Provisional Distance Table (Updated Live)
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Green = Settled shortest route
                </span>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2 px-3">Campus Landmark</th>
                    <th className="py-2 px-3">Shortest Distance</th>
                    <th className="py-2 px-3">Via (Predecessor)</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(Object.keys(currentStepData.dijkstraTable) as CampusNodeId[]).map(
                    (nodeId) => {
                      const entry: DijkstraTableEntry =
                        currentStepData.dijkstraTable![nodeId];
                      const node = CAMPUS_NODES[nodeId];
                      const isCurrent = currentStepData.currentNodeId === nodeId;
                      const isRelaxed = currentStepData.neighborNodeId === nodeId;
                      const isDest = destinationNodeId === nodeId;

                      return (
                        <tr
                          key={nodeId}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-blue-50/80 font-semibold'
                              : isRelaxed
                              ? 'bg-amber-50/70'
                              : entry.settled
                              ? 'bg-emerald-50/30'
                              : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="py-2 px-3 flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                entry.settled
                                  ? 'bg-emerald-500'
                                  : entry.distance < Infinity
                                  ? 'bg-amber-400'
                                  : 'bg-slate-300'
                              }`}
                            />
                            <span className="text-slate-900 font-medium">
                              {node.name}
                            </span>
                            {isDest && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 font-bold">
                                Target
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold">
                            {entry.distance === Infinity ? (
                              <span className="text-slate-400 text-sm font-normal">
                                ∞
                              </span>
                            ) : (
                              <span
                                className={
                                  entry.settled
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }
                              >
                                {entry.distance} m
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-600">
                            {entry.previousNodeId
                              ? CAMPUS_NODES[entry.previousNodeId].name
                              : '—'}
                          </td>
                          <td className="py-2 px-3">
                            {entry.settled ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                Settled
                              </span>
                            ) : entry.distance < Infinity ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                                Provisional
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                                Unreached
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* BFS: Live FIFO Queue Visualization */}
          {algorithm === 'bfs' && (
            <div id="bfs-queue-visualizer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  BFS Queue State (First-In, First-Out)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Size: {currentStepData?.queueState?.length || 0}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 min-h-[70px] flex items-center">
                {currentStepData?.queueState &&
                currentStepData.queueState.length > 0 ? (
                  <div className="flex items-center gap-2 overflow-x-auto w-full py-1">
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider bg-blue-100 px-2 py-1 rounded-md shrink-0">
                      FRONT
                    </span>
                    {currentStepData.queueState.map((nodeId, idx) => (
                      <div
                        key={`q-${nodeId}-${idx}`}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 shadow-2xs ${
                          idx === 0
                            ? 'bg-blue-600 text-white border-blue-700 font-bold'
                            : 'bg-white text-slate-800 border-slate-200'
                        }`}
                      >
                        <span>{CAMPUS_NODES[nodeId].shortName}</span>
                        {idx < currentStepData.queueState!.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    ))}
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider bg-slate-200 px-2 py-1 rounded-md shrink-0">
                      REAR
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic text-center w-full">
                    Queue is currently empty.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DFS: Live LIFO Stack Visualization */}
          {algorithm === 'dfs' && (
            <div id="dfs-stack-visualizer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  DFS Call Stack State (Last-In, First-Out)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Depth: {currentStepData?.stackState?.length || 0}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 min-h-[70px] flex items-center">
                {currentStepData?.stackState &&
                currentStepData.stackState.length > 0 ? (
                  <div className="flex items-center gap-2 overflow-x-auto w-full py-1">
                    <span className="text-[10px] font-bold uppercase text-purple-600 tracking-wider bg-purple-100 px-2 py-1 rounded-md shrink-0">
                      TOP (Next to pop)
                    </span>
                    {/* Reverse to show top of stack first */}
                    {[...currentStepData.stackState].reverse().map((nodeId, idx) => (
                      <div
                        key={`s-${nodeId}-${idx}`}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 shadow-2xs ${
                          idx === 0
                            ? 'bg-purple-600 text-white border-purple-700 font-bold'
                            : 'bg-white text-slate-800 border-slate-200'
                        }`}
                      >
                        <span>{CAMPUS_NODES[nodeId].shortName}</span>
                        {idx < currentStepData.stackState!.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    ))}
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider bg-slate-200 px-2 py-1 rounded-md shrink-0">
                      BOTTOM
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic text-center w-full">
                    Stack is currently empty.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visited Order Sequence Chips */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-slate-500" />
              Visited Order Sequence ({currentStepData?.visitedNodes.length || 0}{' '}
              landmarks)
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentStepData?.visitedNodes &&
              currentStepData.visitedNodes.length > 0 ? (
                currentStepData.visitedNodes.map((nodeId, idx) => (
                  <span
                    key={`visited-${nodeId}-${idx}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    <span className="text-[10px] font-mono text-slate-400">
                      {idx + 1}.
                    </span>
                    {CAMPUS_NODES[nodeId].shortName}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  No nodes visited yet.
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Pseudocode Viewer with line highlighting */
        <div id="algorithm-pseudocode-view" className="font-mono text-xs">
          <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 overflow-x-auto leading-relaxed border border-slate-800">
            {meta.pseudocode.map((line, idx) => {
              const lineNumber = idx + 1;
              const isCurrentLine =
                currentStepData?.pseudocodeLine === lineNumber;

              return (
                <div
                  key={`pseudo-${idx}`}
                  className={`flex items-center gap-3 px-2 py-0.5 rounded ${
                    isCurrentLine
                      ? 'bg-blue-900/60 text-blue-200 font-bold border-l-2 border-blue-400 pl-1.5'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 w-4 select-none shrink-0 text-right">
                    {lineNumber}
                  </span>
                  <pre className="whitespace-pre font-mono">{line}</pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Algorithm Educational Explanation Box */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Viva Insight: </span>
          {meta.description}
        </div>
      </div>
    </div>
  );
};
