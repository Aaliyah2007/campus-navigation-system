export type CampusNodeId =
  | 'main_gate'
  | 'admin_block'
  | 'library'
  | 'cse_block'
  | 'canteen'
  | 'auditorium'
  | 'science_block'
  | 'sports_ground'
  | 'hostel'
  | 'parking_area'
  | 'medical_center'
  | 'student_center';

export type BuildingCategory =
  | 'academic'
  | 'administrative'
  | 'amenity'
  | 'residential'
  | 'sports'
  | 'utility';

export interface CampusNode {
  id: CampusNodeId;
  name: string;
  shortName: string;
  category: BuildingCategory;
  description: string;
  x: number; // SVG coordinate 0-1000
  y: number; // SVG coordinate 0-700
  iconName: string;
}

export interface CampusEdge {
  id: string;
  from: CampusNodeId;
  to: CampusNodeId;
  distance: number; // in meters
  pathType?: 'main_road' | 'walkway';
}

export interface AdjacencyNeighbor {
  nodeId: CampusNodeId;
  distance: number;
  edgeId: string;
}

export type AdjacencyList = Record<CampusNodeId, AdjacencyNeighbor[]>;

export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra';

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  tagline: string;
  description: string;
  dataStructure: string;
  timeComplexity: string;
  spaceComplexity: string;
  weightedSupport: boolean;
  optimalForShortestPath: boolean;
  pseudocode: string[];
}

export type StepActionType =
  | 'INIT'
  | 'SELECT_NODE'
  | 'DEQUEUE'
  | 'POP_STACK'
  | 'EXPLORE_NEIGHBOR'
  | 'RELAX_EDGE'
  | 'SKIP_VISITED'
  | 'NODE_SETTLED'
  | 'DESTINATION_REACHED'
  | 'PATH_RECONSTRUCTED'
  | 'NO_PATH_FOUND';

export interface DijkstraTableEntry {
  distance: number;
  previousNodeId: CampusNodeId | null;
  settled: boolean;
}

export interface AlgorithmStep {
  stepNumber: number;
  totalSteps?: number;
  action: StepActionType;
  description: string;
  currentNodeId: CampusNodeId | null;
  neighborNodeId?: CampusNodeId | null;
  activeEdgeId?: string | null;
  visitedNodes: CampusNodeId[];
  
  // Data structure representations
  queueState?: CampusNodeId[]; // For BFS
  stackState?: CampusNodeId[]; // For DFS
  dijkstraTable?: Record<CampusNodeId, DijkstraTableEntry>; // For Dijkstra
  
  // Highlighting
  exploredEdges: string[];
  finalPathNodes?: CampusNodeId[];
  finalPathEdges?: string[];
  totalPathDistance?: number;
  pseudocodeLine?: number;
}

export interface AlgorithmResult {
  algorithm: AlgorithmType;
  startNodeId: CampusNodeId;
  destinationNodeId: CampusNodeId;
  pathFound: boolean;
  path: CampusNodeId[];
  pathEdges: string[];
  totalDistance: number;
  nodesVisitedCount: number;
  steps: AlgorithmStep[];
  executionTimeMs: number;
}
