import {
  CampusNodeId,
  AlgorithmStep,
  AlgorithmResult,
  DijkstraTableEntry,
} from '../types';
import {
  CAMPUS_NODES,
  ADJACENCY_LIST,
  getEdgeBetween,
  calculatePathDistance,
} from '../data/campusGraph';

/**
 * Dijkstra's Shortest Path Algorithm
 * Finds the true minimum distance route in a non-negative weighted graph.
 *
 * @param start - Origin campus node ID
 * @param destination - Target campus node ID
 * @returns AlgorithmResult containing full table snapshots and shortest route
 */
export function runDijkstra(
  start: CampusNodeId,
  destination: CampusNodeId
): AlgorithmResult {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepNumber = 1;

  const nodeIds = Object.keys(CAMPUS_NODES) as CampusNodeId[];

  // Distance table and previous map
  const distances: Record<CampusNodeId, number> = {} as any;
  const previous: Record<CampusNodeId, CampusNodeId | null> = {} as any;
  const settledNodes: Set<CampusNodeId> = new Set();
  const unvisited: Set<CampusNodeId> = new Set();
  const exploredEdges: Set<string> = new Set();

  nodeIds.forEach((id) => {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  });

  distances[start] = 0;

  const makeTableSnapshot = (): Record<CampusNodeId, DijkstraTableEntry> => {
    const table: Partial<Record<CampusNodeId, DijkstraTableEntry>> = {};
    nodeIds.forEach((id) => {
      table[id] = {
        distance: distances[id],
        previousNodeId: previous[id],
        settled: settledNodes.has(id),
      };
    });
    return table as Record<CampusNodeId, DijkstraTableEntry>;
  };

  // Step 1: Initial state
  steps.push({
    stepNumber: stepNumber++,
    action: 'INIT',
    description: `Initialized Dijkstra. Set distance to origin "${CAMPUS_NODES[start].name}" = 0m. All other 11 campus locations set to ∞.`,
    currentNodeId: start,
    visitedNodes: [],
    dijkstraTable: makeTableSnapshot(),
    exploredEdges: [],
    pseudocodeLine: 1,
  });

  let foundDestination = false;

  while (unvisited.size > 0) {
    // Pick unvisited node with minimum distance
    let currentMinNode: CampusNodeId | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentMinNode = nodeId;
      }
    }

    // If remaining nodes are unreachable
    if (currentMinNode === null || minDistance === Infinity) {
      break;
    }

    const current = currentMinNode;
    unvisited.delete(current);
    settledNodes.add(current);

    steps.push({
      stepNumber: stepNumber++,
      action: 'SELECT_NODE',
      description: `Extracted min-distance location "${CAMPUS_NODES[current].name}" with finalized shortest distance ${distances[current]}m. Node is now settled.`,
      currentNodeId: current,
      visitedNodes: Array.from(settledNodes),
      dijkstraTable: makeTableSnapshot(),
      exploredEdges: Array.from(exploredEdges),
      pseudocodeLine: 4,
    });

    // If destination is settled, we have proven the optimal shortest path
    if (current === destination) {
      foundDestination = true;
      steps.push({
        stepNumber: stepNumber++,
        action: 'DESTINATION_REACHED',
        description: `Target destination "${CAMPUS_NODES[destination].name}" settled with guaranteed minimum distance ${distances[destination]}m!`,
        currentNodeId: current,
        visitedNodes: Array.from(settledNodes),
        dijkstraTable: makeTableSnapshot(),
        exploredEdges: Array.from(exploredEdges),
        pseudocodeLine: 5,
      });
      break;
    }

    // Relax all unvisited neighbors
    const neighbors = ADJACENCY_LIST[current] || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.nodeId;
      const edge = getEdgeBetween(current, neighborId);
      if (edge) exploredEdges.add(edge.id);

      if (settledNodes.has(neighborId)) {
        continue;
      }

      const altDistance = distances[current] + neighbor.distance;

      if (altDistance < distances[neighborId]) {
        const oldDistText =
          distances[neighborId] === Infinity ? '∞' : `${distances[neighborId]}m`;

        distances[neighborId] = altDistance;
        previous[neighborId] = current;

        steps.push({
          stepNumber: stepNumber++,
          action: 'RELAX_EDGE',
          description: `Relaxed edge (${CAMPUS_NODES[current].name} → ${CAMPUS_NODES[neighborId].name}): Found shorter path! Tentative distance improved from ${oldDistText} to ${altDistance}m (via ${CAMPUS_NODES[current].name} + ${neighbor.distance}m).`,
          currentNodeId: current,
          neighborNodeId: neighborId,
          activeEdgeId: edge?.id,
          visitedNodes: Array.from(settledNodes),
          dijkstraTable: makeTableSnapshot(),
          exploredEdges: Array.from(exploredEdges),
          pseudocodeLine: 8,
        });
      } else {
        steps.push({
          stepNumber: stepNumber++,
          action: 'EXPLORE_NEIGHBOR',
          description: `Checked path to "${CAMPUS_NODES[neighborId].name}" via ${CAMPUS_NODES[current].name} (${altDistance}m). Current tentative distance (${distances[neighborId]}m) is already better or equal. No relaxation needed.`,
          currentNodeId: current,
          neighborNodeId: neighborId,
          activeEdgeId: edge?.id,
          visitedNodes: Array.from(settledNodes),
          dijkstraTable: makeTableSnapshot(),
          exploredEdges: Array.from(exploredEdges),
          pseudocodeLine: 7,
        });
      }
    }
  }

  // Reconstruct shortest path
  const path: CampusNodeId[] = [];
  const pathEdges: string[] = [];

  if (distances[destination] !== Infinity) {
    let curr: CampusNodeId | null = destination;
    while (curr) {
      path.unshift(curr);
      if (curr === start) break;
      const prevNode: CampusNodeId | null = previous[curr];
      if (prevNode) {
        const edge = getEdgeBetween(prevNode, curr);
        if (edge) pathEdges.unshift(edge.id);
      }
      curr = prevNode;
    }
  }

  const totalDistance =
    distances[destination] === Infinity ? 0 : distances[destination];

  // Final step
  steps.push({
    stepNumber: stepNumber++,
    action: 'PATH_RECONSTRUCTED',
    description:
      distances[destination] !== Infinity
        ? `Dijkstra shortest path resolved! Total optimal distance: ${totalDistance}m over ${path.length - 1} road segment(s).`
        : `No route exists between "${CAMPUS_NODES[start].name}" and "${CAMPUS_NODES[destination].name}".`,
    currentNodeId: distances[destination] !== Infinity ? destination : null,
    visitedNodes: Array.from(settledNodes),
    dijkstraTable: makeTableSnapshot(),
    exploredEdges: Array.from(exploredEdges),
    finalPathNodes: path,
    finalPathEdges: pathEdges,
    totalPathDistance: totalDistance,
    pseudocodeLine: 10,
  });

  steps.forEach((s) => (s.totalSteps = steps.length));
  const endTime = performance.now();

  return {
    algorithm: 'dijkstra',
    startNodeId: start,
    destinationNodeId: destination,
    pathFound: distances[destination] !== Infinity,
    path,
    pathEdges,
    totalDistance,
    nodesVisitedCount: settledNodes.size,
    steps,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
  };
}
