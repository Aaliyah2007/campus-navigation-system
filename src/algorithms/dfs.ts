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
 * Depth-First Search (DFS) implementation
 * Explores deeply along one branch before backtracking using a LIFO Stack.
 *
 * @param start - Origin campus node ID
 * @param destination - Target campus node ID
 * @returns AlgorithmResult containing execution steps and reconstructed route
 */
export function runDFS(
  start: CampusNodeId,
  destination: CampusNodeId
): AlgorithmResult {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  let stepNumber = 1;

  const stack: CampusNodeId[] = [];
  const visited: Set<CampusNodeId> = new Set();
  const parentMap: Map<CampusNodeId, CampusNodeId> = new Map();
  const exploredEdges: Set<string> = new Set();

  // Push start node to stack
  stack.push(start);

  steps.push({
    stepNumber: stepNumber++,
    action: 'INIT',
    description: `Initialized DFS. Pushed origin location "${CAMPUS_NODES[start].name}" onto the call Stack.`,
    currentNodeId: start,
    visitedNodes: Array.from(visited),
    stackState: [...stack],
    exploredEdges: [],
    pseudocodeLine: 2,
  });

  let foundDestination = false;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!visited.has(current)) {
      visited.add(current);

      steps.push({
        stepNumber: stepNumber++,
        action: 'POP_STACK',
        description: `Popped "${CAMPUS_NODES[current].name}" from Top of Stack and marked as visited. Current active exploration node.`,
        currentNodeId: current,
        visitedNodes: Array.from(visited),
        stackState: [...stack],
        exploredEdges: Array.from(exploredEdges),
        pseudocodeLine: 4,
      });

      // Destination reached
      if (current === destination) {
        foundDestination = true;
        steps.push({
          stepNumber: stepNumber++,
          action: 'DESTINATION_REACHED',
          description: `Target destination "${CAMPUS_NODES[destination].name}" reached via deep branch traversal!`,
          currentNodeId: current,
          visitedNodes: Array.from(visited),
          stackState: [...stack],
          exploredEdges: Array.from(exploredEdges),
          pseudocodeLine: 6,
        });
        break;
      }

      // Collect adjacent unvisited neighbors
      const neighbors = ADJACENCY_LIST[current] || [];
      let unvisitedCount = 0;

      // Iterate in reverse for intuitive left-to-right processing order when popping
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        const neighborId = neighbor.nodeId;
        const edge = getEdgeBetween(current, neighborId);
        if (edge) exploredEdges.add(edge.id);

        if (!visited.has(neighborId)) {
          unvisitedCount++;
          if (!parentMap.has(neighborId)) {
            parentMap.set(neighborId, current);
          }
          stack.push(neighborId);

          steps.push({
            stepNumber: stepNumber++,
            action: 'EXPLORE_NEIGHBOR',
            description: `Branching out to unvisited neighbor "${CAMPUS_NODES[neighborId].name}" (${neighbor.distance}m). Pushed onto Stack.`,
            currentNodeId: current,
            neighborNodeId: neighborId,
            activeEdgeId: edge?.id,
            visitedNodes: Array.from(visited),
            stackState: [...stack],
            exploredEdges: Array.from(exploredEdges),
            pseudocodeLine: 8,
          });
        }
      }

      if (unvisitedCount === 0 && stack.length > 0) {
        steps.push({
          stepNumber: stepNumber++,
          action: 'SKIP_VISITED',
          description: `No further unvisited paths from "${CAMPUS_NODES[current].name}". Backtracking up the stack.`,
          currentNodeId: current,
          visitedNodes: Array.from(visited),
          stackState: [...stack],
          exploredEdges: Array.from(exploredEdges),
          pseudocodeLine: 4,
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
      ? `DFS traversal complete. Path found with ${path.length - 1} road segment(s) (${totalDistance}m total distance). Note: DFS does not guarantee shortest distance.`
      : `DFS traversal ended without finding a connecting route to "${CAMPUS_NODES[destination].name}".`,
    currentNodeId: foundDestination ? destination : null,
    visitedNodes: Array.from(visited),
    stackState: [...stack],
    exploredEdges: Array.from(exploredEdges),
    finalPathNodes: path,
    finalPathEdges: pathEdges,
    totalPathDistance: totalDistance,
    pseudocodeLine: 6,
  });

  steps.forEach((s) => (s.totalSteps = steps.length));
  const endTime = performance.now();

  return {
    algorithm: 'dfs',
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
