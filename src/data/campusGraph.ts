import {
  CampusNode,
  CampusEdge,
  CampusNodeId,
  AdjacencyList,
  AlgorithmMetadata,
} from '../types';

export const CAMPUS_NODES: Record<CampusNodeId, CampusNode> = {
  main_gate: {
    id: 'main_gate',
    name: 'Main Gate',
    shortName: 'Gate',
    category: 'utility',
    description: 'Primary campus entrance, security checkpoint, and shuttle stop.',
    x: 100,
    y: 350,
    iconName: 'Shield',
  },
  parking_area: {
    id: 'parking_area',
    name: 'Parking Area',
    shortName: 'Parking',
    category: 'utility',
    description: 'Student, faculty & visitor two-wheeler and car parking terminal.',
    x: 150,
    y: 560,
    iconName: 'Car',
  },
  admin_block: {
    id: 'admin_block',
    name: 'Administrative Block',
    shortName: 'Admin',
    category: 'administrative',
    description: "Dean's office, registrar, admissions office, and finance council.",
    x: 270,
    y: 240,
    iconName: 'Building',
  },
  medical_center: {
    id: 'medical_center',
    name: 'Medical Center',
    shortName: 'Health',
    category: 'amenity',
    description: '24/7 campus dispensary, medical emergency response & pharmacy.',
    x: 340,
    y: 90,
    iconName: 'Stethoscope',
  },
  library: {
    id: 'library',
    name: 'Central Library',
    shortName: 'Library',
    category: 'academic',
    description: '4-floor digital archives, journals, quiet study rooms & media center.',
    x: 480,
    y: 200,
    iconName: 'BookOpen',
  },
  cse_block: {
    id: 'cse_block',
    name: 'Computer Science Block',
    shortName: 'CSE',
    category: 'academic',
    description: 'AI & Data Science laboratories, lecture halls & coding incubators.',
    x: 460,
    y: 370,
    iconName: 'Laptop',
  },
  canteen: {
    id: 'canteen',
    name: 'Campus Canteen',
    shortName: 'Canteen',
    category: 'amenity',
    description: 'Main dining hall, bakery, coffee bar & open student lounge.',
    x: 370,
    y: 530,
    iconName: 'Coffee',
  },
  science_block: {
    id: 'science_block',
    name: 'Science Block',
    shortName: 'Science',
    category: 'academic',
    description: 'Physics, Chemistry, and Nanotechnology advanced research wings.',
    x: 650,
    y: 270,
    iconName: 'FlaskConical',
  },
  student_center: {
    id: 'student_center',
    name: 'Student Activity Center',
    shortName: 'Student Ctr',
    category: 'amenity',
    description: 'Robotics club, cultural hub, indoor badminton & music rooms.',
    x: 620,
    y: 470,
    iconName: 'Users',
  },
  auditorium: {
    id: 'auditorium',
    name: 'Main Auditorium',
    shortName: 'Auditorium',
    category: 'academic',
    description: '1,200-seat university event theater for convocation & symposiums.',
    x: 820,
    y: 150,
    iconName: 'Music',
  },
  hostel: {
    id: 'hostel',
    name: 'Student Hostel',
    shortName: 'Hostel',
    category: 'residential',
    description: 'Campus residential quarters with recreational common lounges.',
    x: 800,
    y: 540,
    iconName: 'Home',
  },
  sports_ground: {
    id: 'sports_ground',
    name: 'Sports Ground',
    shortName: 'Sports',
    category: 'sports',
    description: 'Athletic synthetic track, cricket pitch & basketball courts.',
    x: 910,
    y: 360,
    iconName: 'Trophy',
  },
};

export const CAMPUS_EDGES: CampusEdge[] = [
  // Roads connecting the campus
  { id: 'e1', from: 'main_gate', to: 'admin_block', distance: 120, pathType: 'main_road' },
  { id: 'e2', from: 'main_gate', to: 'parking_area', distance: 80, pathType: 'main_road' },
  { id: 'e3', from: 'admin_block', to: 'library', distance: 150, pathType: 'main_road' },
  { id: 'e4', from: 'admin_block', to: 'cse_block', distance: 180, pathType: 'main_road' },
  { id: 'e5', from: 'admin_block', to: 'medical_center', distance: 110, pathType: 'walkway' },
  { id: 'e6', from: 'medical_center', to: 'auditorium', distance: 130, pathType: 'walkway' },
  { id: 'e7', from: 'medical_center', to: 'science_block', distance: 170, pathType: 'walkway' },
  { id: 'e8', from: 'library', to: 'cse_block', distance: 100, pathType: 'walkway' },
  { id: 'e9', from: 'library', to: 'student_center', distance: 120, pathType: 'main_road' },
  { id: 'e10', from: 'cse_block', to: 'science_block', distance: 140, pathType: 'main_road' },
  { id: 'e11', from: 'cse_block', to: 'canteen', distance: 100, pathType: 'walkway' },
  { id: 'e12', from: 'science_block', to: 'auditorium', distance: 160, pathType: 'main_road' },
  { id: 'e13', from: 'parking_area', to: 'canteen', distance: 250, pathType: 'main_road' },
  { id: 'e14', from: 'canteen', to: 'student_center', distance: 90, pathType: 'walkway' },
  { id: 'e15', from: 'canteen', to: 'hostel', distance: 190, pathType: 'walkway' },
  { id: 'e16', from: 'student_center', to: 'hostel', distance: 200, pathType: 'main_road' },
  { id: 'e17', from: 'hostel', to: 'sports_ground', distance: 150, pathType: 'main_road' },
  { id: 'e18', from: 'auditorium', to: 'sports_ground', distance: 210, pathType: 'main_road' },
];

/**
 * Builds an undirected Adjacency List from the edges
 */
export function buildAdjacencyList(): AdjacencyList {
  const adj: Partial<AdjacencyList> = {};

  (Object.keys(CAMPUS_NODES) as CampusNodeId[]).forEach((nodeId) => {
    adj[nodeId] = [];
  });

  CAMPUS_EDGES.forEach((edge) => {
    adj[edge.from]?.push({
      nodeId: edge.to,
      distance: edge.distance,
      edgeId: edge.id,
    });
    adj[edge.to]?.push({
      nodeId: edge.from,
      distance: edge.distance,
      edgeId: edge.id,
    });
  });

  return adj as AdjacencyList;
}

export const ADJACENCY_LIST = buildAdjacencyList();

/**
 * Helper to locate an edge ID between two nodes
 */
export function getEdgeBetween(u: CampusNodeId, v: CampusNodeId): CampusEdge | undefined {
  return CAMPUS_EDGES.find(
    (e) => (e.from === u && e.to === v) || (e.from === v && e.to === u)
  );
}

/**
 * Calculate total distance for an ordered path of nodes
 */
export function calculatePathDistance(path: CampusNodeId[]): number {
  if (path.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = getEdgeBetween(path[i], path[i + 1]);
    if (edge) total += edge.distance;
  }
  return total;
}

/**
 * Algorithm Metadata including complexity and pseudocode
 */
export const ALGORITHM_METADATA: Record<string, AlgorithmMetadata> = {
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    tagline: 'Level-by-Level Graph Exploration',
    description:
      'BFS explores the graph layer by layer using a First-In-First-Out (FIFO) queue. In an unweighted graph, it guarantees finding the path with the fewest road segments (minimum edges).',
    dataStructure: 'Queue (FIFO)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    weightedSupport: false,
    optimalForShortestPath: false,
    pseudocode: [
      'function BFS(start, destination):',
      '  create empty Queue Q and visited Set',
      '  enqueue start into Q; mark start as visited',
      '  while Q is not empty:',
      '    current = Q.dequeue()',
      '    if current == destination: return reconstruct_path()',
      '    for each neighbor of current:',
      '      if neighbor not in visited:',
      '        mark neighbor as visited; parent[neighbor] = current',
      '        Q.enqueue(neighbor)',
    ],
  },
  dfs: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    tagline: 'Deep Exploration with Backtracking',
    description:
      'DFS dives as deep as possible along each branch before backtracking using a Last-In-First-Out (LIFO) stack or recursion. It is ideal for connectivity, topological sorting, and maze exploration.',
    dataStructure: 'Stack / Recursion (LIFO)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    weightedSupport: false,
    optimalForShortestPath: false,
    pseudocode: [
      'function DFS(start, destination):',
      '  create empty Stack S and visited Set',
      '  push start onto S',
      '  while S is not empty:',
      '    current = S.pop()',
      '    if current not in visited:',
      '      mark current as visited',
      '      if current == destination: return reconstruct_path()',
      '      for each unvisited neighbor of current:',
      '        parent[neighbor] = current; S.push(neighbor)',
    ],
  },
  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    tagline: 'Optimal Shortest Path on Weighted Graphs',
    description:
      "Dijkstra's greedy algorithm systematically computes the minimal total distance in meters between campus landmarks by continually relaxing adjacent road lengths using a priority queue.",
    dataStructure: 'Min-Priority Queue / Distance Table',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    weightedSupport: true,
    optimalForShortestPath: true,
    pseudocode: [
      'function Dijkstra(start, destination):',
      '  dist[all] = ∞; dist[start] = 0; prev[all] = null',
      '  insert (0, start) into PriorityQueue PQ',
      '  while PQ is not empty:',
      '    current = extract_min(PQ)',
      '    if current == destination: break',
      '    for each (neighbor, weight) of current:',
      '      if dist[current] + weight < dist[neighbor]:',
      '        dist[neighbor] = dist[current] + weight',
      '        prev[neighbor] = current; PQ.update(neighbor, dist[neighbor])',
      '  return reconstruct_path(destination), dist[destination]',
    ],
  },
};
