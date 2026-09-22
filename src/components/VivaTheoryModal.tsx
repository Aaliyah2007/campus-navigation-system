import React from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Clock,
  Database,
  ArrowRight,
} from 'lucide-react';

interface VivaTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaTheoryModal: React.FC<VivaTheoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="viva-theory-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="viva-theory-modal-dialog"
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                College Viva & DSA Theory Reference
              </h2>
              <p className="text-xs text-slate-500">
                Key concepts, complexity analysis, and viva questions for project demonstration
              </p>
            </div>
          </div>

          <button
            id="viva-modal-close-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Section 1: Algorithm Comparison Table */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              1. Algorithm Comparison Matrix
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-3">Data Structure</th>
                    <th className="py-2.5 px-3">Time Complexity</th>
                    <th className="py-2.5 px-3">Space Complexity</th>
                    <th className="py-2.5 px-3">Weighted Graph?</th>
                    <th className="py-2.5 px-3">Optimal Route?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-bold text-blue-900">
                      BFS (Breadth-First)
                    </td>
                    <td className="py-2 px-3 font-mono">Queue (FIFO)</td>
                    <td className="py-2 px-3 font-mono">O(V + E)</td>
                    <td className="py-2 px-3 font-mono">O(V)</td>
                    <td className="py-2 px-3 text-rose-600">No (Unweighted)</td>
                    <td className="py-2 px-3 text-slate-700">
                      Minimum Edge Hops only
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-2 px-3 font-bold text-purple-900">
                      DFS (Depth-First)
                    </td>
                    <td className="py-2 px-3 font-mono">Stack (LIFO)</td>
                    <td className="py-2 px-3 font-mono">O(V + E)</td>
                    <td className="py-2 px-3 font-mono">O(V)</td>
                    <td className="py-2 px-3 text-rose-600">No (Unweighted)</td>
                    <td className="py-2 px-3 text-rose-600">
                      Not guaranteed (backtracks)
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 bg-emerald-50/20">
                    <td className="py-2 px-3 font-bold text-emerald-900">
                      Dijkstra's Algorithm
                    </td>
                    <td className="py-2 px-3 font-mono">
                      Min-Priority Queue / Array
                    </td>
                    <td className="py-2 px-3 font-mono">O((V + E) log V)</td>
                    <td className="py-2 px-3 font-mono">O(V)</td>
                    <td className="py-2 px-3 text-emerald-700 font-semibold">
                      Yes (Non-negative)
                    </td>
                    <td className="py-2 px-3 text-emerald-700 font-semibold">
                      Guaranteed Minimal Meters
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Why Adjacency List instead of Adjacency Matrix */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-600" />
              Why use an Adjacency List for Campus Navigation?
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              A college campus graph is a <strong>sparse graph</strong> (where |E| ≪ |V|²). With 12 buildings and only 18 roads, an Adjacency Matrix would waste O(V²) memory with 144 cells, most of which are 0.
              The <strong>Adjacency List</strong> uses only <strong>O(V + E)</strong> memory and allows iterating over neighbors in O(deg(v)) rather than scanning all V nodes, making graph traversals significantly faster.
            </p>
          </div>

          {/* Section 3: Frequently Asked Viva Questions */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              3. Typical Viva Questions & Model Answers
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 mb-1">
                  Q1: Why does BFS fail to find the shortest path in a weighted graph?
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Answer:</strong> BFS assumes all edges have uniform weight (1 hop). It explores level-by-level based on hop count. If Path A has 1 road of 500m, and Path B has 2 roads of 50m each (total 100m), BFS will select Path A because it has fewer hops (1 vs 2), even though Path B is 400m shorter!
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 mb-1">
                  Q2: What is "Edge Relaxation" in Dijkstra's algorithm?
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Answer:</strong> Relaxation is the process of testing whether the shortest known distance to node <em>v</em> can be improved by traveling through node <em>u</em>. Specifically, if <code>dist[u] + weight(u, v) &lt; dist[v]</code>, we update <code>dist[v] = dist[u] + weight(u, v)</code> and set <code>previous[v] = u</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div className="font-semibold text-slate-900 mb-1">
                  Q3: Does Dijkstra work with negative edge weights?
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Answer:</strong> No. Dijkstra is a greedy algorithm that permanently settles a node once extracted from the priority queue, assuming its shortest path will never decrease. Negative edge weights violate this assumption (requiring Bellman-Ford algorithm). However, physical campus distances can never be negative, making Dijkstra optimal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            id="viva-modal-got-it-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
          >
            Close Viva Reference
          </button>
        </div>
      </div>
    </div>
  );
};
