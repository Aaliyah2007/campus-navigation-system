import React, { useState, useRef } from 'react';
import {
  CampusNodeId,
  CampusNode,
  CampusEdge,
} from '../types';
import {
  CAMPUS_NODES,
  CAMPUS_EDGES,
} from '../data/campusGraph';
import {
  Shield,
  Car,
  Building,
  Stethoscope,
  BookOpen,
  Laptop,
  Coffee,
  FlaskConical,
  Users,
  Music,
  Home,
  Trophy,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Eye,
  EyeOff,
} from 'lucide-react';

interface CampusMapProps {
  startNodeId: CampusNodeId;
  destinationNodeId: CampusNodeId;
  currentNodeId: CampusNodeId | null;
  visitedNodes: CampusNodeId[];
  queueOrStackNodes?: CampusNodeId[];
  pathNodes: CampusNodeId[];
  pathEdges: string[];
  exploredEdges: string[];
  onSelectNode: (nodeId: CampusNodeId) => void;
  selectionMode: 'start' | 'destination' | 'auto';
  onSetSelectionMode?: (mode: 'start' | 'destination' | 'auto') => void;
}

// Icon mapper for campus building nodes
const renderBuildingIcon = (iconName: string, className: string = 'w-4 h-4') => {
  switch (iconName) {
    case 'Shield':
      return <Shield className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Music':
      return <Music className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    default:
      return <Building className={className} />;
  }
};

export const CampusMap: React.FC<CampusMapProps> = ({
  startNodeId,
  destinationNodeId,
  currentNodeId,
  visitedNodes,
  queueOrStackNodes = [],
  pathNodes,
  pathEdges,
  exploredEdges,
  onSelectNode,
  selectionMode,
  onSetSelectionMode,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showDistances, setShowDistances] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<CampusNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.7));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'map-svg-bg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      id="campus-map-container"
      ref={containerRef}
      className="relative bg-gradient-to-br from-slate-900/5 via-slate-50 to-blue-50/20 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden h-[460px] sm:h-[540px] select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Quick Selection Mode Chips */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs pointer-events-auto text-xs">
          <span className="text-slate-500 font-medium mr-1 hidden sm:inline">Click to set:</span>
          <button
            id="map-mode-start-btn"
            onClick={() => onSetSelectionMode?.('start')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectionMode === 'start'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Start (A)
          </button>
          <button
            id="map-mode-dest-btn"
            onClick={() => onSetSelectionMode?.('destination')}
            className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
              selectionMode === 'destination'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dest (B)
          </button>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 shadow-xs pointer-events-auto">
          <button
            id="toggle-distances-btn"
            onClick={() => setShowDistances(!showDistances)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={showDistances ? 'Hide Distance Labels' : 'Show Distance Labels'}
          >
            {showDistances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>
          <div className="w-[1px] h-4 bg-slate-200" />
          <button
            id="map-zoom-in-btn"
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="map-zoom-out-btn"
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="map-reset-view-btn"
            onClick={handleResetView}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Center Map"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <svg
        id="campus-graph-svg"
        viewBox="0 0 1020 660"
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.6" />
          </pattern>

          {/* Glow filter for active shortest path */}
          <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Background Grid */}
        <rect id="map-svg-bg" width="1020" height="660" fill="url(#campusGrid)" />

        {/* Campus Landscaping / Zones Subtle Shapes */}
        <g id="campus-zones" opacity="0.35">
          {/* Sports Complex Grass Field */}
          <rect x="850" y="270" width="150" height="240" rx="30" fill="#bbf7d0" stroke="#86efac" strokeWidth="2" strokeDasharray="4 4" />
          <text x="925" y="475" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="600" opacity="0.7">
            Sports Zone
          </text>

          {/* Academic Quad Garden */}
          <circle cx="560" cy="280" r="75" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1.5" />
          <text x="560" y="284" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="600" opacity="0.7">
            Central Quad
          </text>

          {/* Residential Dorm Area */}
          <rect x="730" y="470" width="140" height="150" rx="20" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5" />
          <text x="800" y="605" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="600" opacity="0.7">
            Hostel Green
          </text>
        </g>

        {/* EDGES (ROADS & PATHWAYS) */}
        <g id="campus-roads">
          {CAMPUS_EDGES.map((edge) => {
            const u = CAMPUS_NODES[edge.from];
            const v = CAMPUS_NODES[edge.to];
            const isOnPath = pathEdges.includes(edge.id);
            const isExplored = exploredEdges.includes(edge.id);
            const isWalkway = edge.pathType === 'walkway';

            // Calculate midpoint for distance label
            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            // Offset label slightly perpendicular to the line to avoid overlapping the line
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const len = Math.hypot(dx, dy) || 1;
            const offsetX = -dy / len * 9;
            const offsetY = dx / len * 9;

            return (
              <g key={edge.id} id={`edge-${edge.id}`}>
                {/* Background road line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={
                    isOnPath
                      ? '#059669' // emerald-600
                      : isExplored
                      ? '#3b82f6' // blue-500
                      : '#cbd5e1' // slate-300
                  }
                  strokeWidth={isOnPath ? 6 : isExplored ? 3.5 : 2.5}
                  strokeDasharray={isOnPath ? undefined : isWalkway ? '5,4' : undefined}
                  strokeLinecap="round"
                  filter={isOnPath ? 'url(#pathGlow)' : undefined}
                  className="transition-all duration-300"
                />

                {/* Animated dash overlay for active shortest path */}
                {isOnPath && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#a7f3d0"
                    strokeWidth={2.5}
                    strokeDasharray="6,6"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                )}

                {/* Distance Badge in Meters */}
                {showDistances && (
                  <g
                    transform={`translate(${midX + offsetX}, ${midY + offsetY})`}
                    className="pointer-events-none select-none"
                  >
                    <rect
                      x="-20"
                      y="-9"
                      width="40"
                      height="18"
                      rx="9"
                      fill={
                        isOnPath
                          ? '#065f46'
                          : isExplored
                          ? '#1e3a8a'
                          : '#ffffff'
                      }
                      stroke={
                        isOnPath
                          ? '#34d399'
                          : isExplored
                          ? '#93c5fd'
                          : '#e2e8f0'
                      }
                      strokeWidth="1.2"
                      filter="url(#nodeShadow)"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isOnPath || isExplored ? '#ffffff' : '#475569'}
                      fontSize="9.5"
                      fontWeight={isOnPath ? '700' : '600'}
                      fontFamily="monospace"
                    >
                      {edge.distance}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* NODES (BUILDINGS & LOCATIONS) */}
        <g id="campus-nodes">
          {(Object.values(CAMPUS_NODES) as CampusNode[]).map((node) => {
            const isStart = node.id === startNodeId;
            const isDestination = node.id === destinationNodeId;
            const isCurrent = node.id === currentNodeId;
            const isVisited = visitedNodes.includes(node.id);
            const isInQueueOrStack = queueOrStackNodes.includes(node.id);
            const isOnPath = pathNodes.includes(node.id);

            // Determine node badge styling
            let nodeBg = '#ffffff';
            let nodeBorder = '#94a3b8';
            let iconColor = '#334155';
            let badgeText: string | null = null;
            let badgeBg = '#0f172a';

            if (isStart) {
              nodeBg = '#ecfdf5';
              nodeBorder = '#10b981';
              iconColor = '#047857';
              badgeText = 'START';
              badgeBg = '#059669';
            } else if (isDestination) {
              nodeBg = '#fff1f2';
              nodeBorder = '#f43f5e';
              iconColor = '#be123c';
              badgeText = 'DEST';
              badgeBg = '#e11d48';
            } else if (isCurrent) {
              nodeBg = '#eff6ff';
              nodeBorder = '#3b82f6';
              iconColor = '#1d4ed8';
              badgeText = 'CURR';
              badgeBg = '#2563eb';
            } else if (isOnPath) {
              nodeBg = '#d1fae5';
              nodeBorder = '#059669';
              iconColor = '#065f46';
            } else if (isVisited) {
              nodeBg = '#f1f5f9';
              nodeBorder = '#64748b';
              iconColor = '#475569';
            } else if (isInQueueOrStack) {
              nodeBg = '#fef3c7';
              nodeBorder = '#f59e0b';
              iconColor = '#b45309';
            }

            return (
              <g
                key={node.id}
                id={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode(node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {/* Active Pulsing Halo Ring for Current Node */}
                {isCurrent && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Path Halo */}
                {isOnPath && !isStart && !isDestination && (
                  <circle
                    r="27"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-spin-slow"
                  />
                )}

                {/* Main Circular Node Card */}
                <circle
                  r={isStart || isDestination ? 24 : 20}
                  fill={nodeBg}
                  stroke={nodeBorder}
                  strokeWidth={isStart || isDestination || isCurrent || isOnPath ? 3.5 : 2}
                  filter="url(#nodeShadow)"
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Node Center Icon */}
                <foreignObject
                  x={isStart || isDestination ? -11 : -9}
                  y={isStart || isDestination ? -11 : -9}
                  width={isStart || isDestination ? 22 : 18}
                  height={isStart || isDestination ? 22 : 18}
                  className="pointer-events-none"
                >
                  <div className="flex items-center justify-center w-full h-full text-current" style={{ color: iconColor }}>
                    {renderBuildingIcon(
                      node.iconName,
                      isStart || isDestination ? 'w-5 h-5' : 'w-4 h-4'
                    )}
                  </div>
                </foreignObject>

                {/* Badge Indicator (START / DEST / CURR) */}
                {badgeText && (
                  <g transform="translate(0, -29)">
                    <rect
                      x="-19"
                      y="-8"
                      width="38"
                      height="16"
                      rx="8"
                      fill={badgeBg}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8.5"
                      fontWeight="700"
                      letterSpacing="0.5"
                    >
                      {badgeText}
                    </text>
                  </g>
                )}

                {/* Building Title Label */}
                <g transform="translate(0, 31)">
                  <rect
                    x={-(node.name.length * 3.4) - 6}
                    y="-9"
                    width={node.name.length * 6.8 + 12}
                    height="18"
                    rx="5"
                    fill="#ffffff"
                    fillOpacity="0.95"
                    stroke={isOnPath ? '#10b981' : isCurrent ? '#3b82f6' : '#e2e8f0'}
                    strokeWidth="1"
                    filter="url(#nodeShadow)"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill={isOnPath ? '#065f46' : '#0f172a'}
                    fontSize="10"
                    fontWeight={isOnPath || isStart || isDestination ? '700' : '600'}
                    className="pointer-events-none"
                  >
                    {node.shortName}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Card (Building Details Tooltip) */}
      {hoveredNode && (
        <div
          id="map-hover-tooltip"
          className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-md max-w-xs pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              {renderBuildingIcon(hoveredNode.iconName, 'w-3.5 h-3.5')}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {hoveredNode.name}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                {hoveredNode.category} landmark
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {hoveredNode.description}
          </p>
          <div className="mt-2 text-[10px] text-blue-600 font-medium">
            Click to set as {selectionMode === 'start' ? 'Starting Point' : 'Destination'}
          </div>
        </div>
      )}

      {/* Map Legend (Bottom Right) */}
      <div
        id="map-legend-box"
        className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs text-[11px]"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          <span className="text-slate-600 font-medium">Start</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200" />
          <span className="text-slate-600 font-medium">Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200" />
          <span className="text-slate-600 font-medium">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 rounded-full bg-emerald-600" />
          <span className="text-slate-600 font-medium">Shortest Route</span>
        </div>
      </div>
    </div>
  );
};
