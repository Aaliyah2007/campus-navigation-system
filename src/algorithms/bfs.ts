import {
  CampusNodeId,
  AlgorithmStep,
  AlgorithmResult,
} from '../types';
import {
  CAMPUS_NODES,
  ADJACENCY_LIST,
  getEdgeBetween,
  calculatePathDistance,
} from '../data/campusGraph';

/**
 * Breadth-First Search (BFS) implementation
 * Traverses level-by-level using a FIFO Queue.
 *
 * @param start - Origin campus node ID
 * @param destination - Target campus node ID (optional, but used for pathfinding)
 * @returns AlgorithmResult containing execution steps and reconstructed route
 */
export function runBFS(
  start: CampusNodeId,
  destination: CampusNodeId
): AlgorithmResult {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepNumber = 1;

  const queue: CampusNodeId[] = [];
  const visited: Set<CampusNodeId> = new Set();
  const parentMap: Map<CampusNodeId, CampusNodeId> = new Map();
  const exploredEdges: Set<string> = new Set();

  // Step 1: Initialization
  queue.push(start);
  visited.add(start);

  steps.push({
    stepNumber: stepNumber++,
    action: 'INIT',
    description: `Initialized BFS. Enqueued starting location "${CAMPUS_NODES[start].name}" into the Queue. Visited count: 1.`,
    currentNodeId: start,
    visitedNodes: Array.from(visited),
    queueState: [...queue],
    exploredEdges: [],
    pseudocodeLine: 2,
  });

  let foundDestination = false;

  // While queue is not empty
  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      stepNumber: stepNumber++,
      action: 'DEQUEUE',
      description: `Dequeued "${CAMPUS_NODES[current].name}" from front of Queue. Current exploring location.`,
      currentNodeId: current,
      visitedNodes: Array.from(visited),
      queueState: [...queue],
      exploredEdges: Array.from(exploredEdges),
      pseudocodeLine: 4,
    });

    // Check if reached destination
    if (current === destination) {
      foundDestination = true;
      steps.push({
        stepNumber: stepNumber++,
        action: 'DESTINATION_REACHED',
        description: `Target destination "${CAMPUS_NODES[destination].name}" reached! Reconstructing fewest-hops pathway.`,
        currentNodeId: current,
        visitedNodes: Array.from(visited),
        queueState: [...queue],
        exploredEdges: Array.from(exploredEdges),
        pseudocodeLine: 5,
      });
      break;
    }

    // Inspect adjacent neighbors
    const neighbors = ADJACENCY_LIST[current] || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.nodeId;
      const edge = getEdgeBetween(current, neighborId);
      if (edge) exploredEdges.add(edge.id);

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        parentMap.set(neighborId, current);
        queue.push(neighborId);

        steps.push({
          stepNumber: stepNumber++,
          action: 'EXPLORE_NEIGHBOR',
          description: `Discovered unvisited neighbor "${CAMPUS_NODES[neighborId].name}" (${neighbor.distance}m via ${edge?.pathType === 'walkway' ? 'walkway' : 'road'}). Added to Queue and marked visited.`,
          currentNodeId: current,
          neighborNodeId: neighborId,
          activeEdgeId: edge?.id,
          visitedNodes: Array.from(visited),
          queueState: [...queue],
          exploredEdges: Array.from(exploredEdges),
          pseudocodeLine: 8,
        });
      } else {
        // Already visited
        steps.push({
          stepNumber: stepNumber++,
          action: 'SKIP_VISITED',
          description: `Inspected neighbor "${CAMPUS_NODES[neighborId].name}", but it is already visited. Skipping to prevent cycles.`,
          currentNodeId: current,
          neighborNodeId: neighborId,
          activeEdgeId: edge?.id,
          visitedNodes: Array.from(visited),
          queueState: [...queue],
          exploredEdges: Array.from(exploredEdges),
          pseudocodeLine: 7,
        });
      }
    }
  }

  // Reconstruct path
  const path: CampusNodeId[] = [];
  const pathEdges: string[] = [];

  if (foundDestination || start === destination) {
    let curr: CampusNodeId | undefined = destination;
    while (curr) {
      path.unshift(curr);
      if (curr === start) break;
      const prev = parentMap.get(curr);
      if (prev) {
        const edge = getEdgeBetween(prev, curr);
        if (edge) pathEdges.unshift(edge.id);
      }
      curr = prev;
    }
  }

  const totalDistance = calculatePathDistance(path);

  // Final Step: Complete
  steps.push({
    stepNumber: stepNumber++,
    action: 'PATH_RECONSTRUCTED',
    description: foundDestination
      ? `BFS traversal complete. Path found with ${path.length - 1} road segment(s) (${totalDistance}m total distance).`
      : `BFS traversal ended. No connecting path to "${CAMPUS_NODES[destination].name}".`,
    currentNodeId: foundDestination ? destination : null,
    visitedNodes: Array.from(visited),
    queueState: [...queue],
    exploredEdges: Array.from(exploredEdges),
    finalPathNodes: path,
    finalPathEdges: pathEdges,
    totalPathDistance: totalDistance,
    pseudocodeLine: 5,
  });

  // Assign total steps
  steps.forEach((s) => (s.totalSteps = steps.length));

  const endTime = performance.now();

  return {
    algorithm: 'bfs',
    startNodeId: start,
    destinationNodeId: destination,
    pathFound: foundDestination || start === destination,
    path,
    pathEdges,
    totalDistance,
    nodesVisitedCount: visited.size,
    steps,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
  };
}
