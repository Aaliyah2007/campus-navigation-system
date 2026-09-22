import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CampusNodeId,
  AlgorithmType,
  AlgorithmResult,
  AlgorithmStep,
} from './types';
import {
  CAMPUS_NODES,
  CAMPUS_EDGES,
} from './data/campusGraph';
import { runBFS } from './algorithms/bfs';
import { runDFS } from './algorithms/dfs';
import { runDijkstra } from './algorithms/dijkstra';
import { CampusHeader } from './components/CampusHeader';
import { CampusStats } from './components/CampusStats';
import { CampusMap } from './components/CampusMap';
import { RouteControls } from './components/RouteControls';
import { StepControls } from './components/StepControls';
import { AlgorithmInfoPanel } from './components/AlgorithmInfoPanel';
import { RouteResultCard } from './components/RouteResultCard';
import { VivaTheoryModal } from './components/VivaTheoryModal';

export default function App() {
  // Navigation State
  const [startNodeId, setStartNodeId] = useState<CampusNodeId>('main_gate');
  const [destinationNodeId, setDestinationNodeId] = useState<CampusNodeId>('library');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('dijkstra');

  // Visualization & Playback State
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800); // 800ms default

  // Map Click Selection Mode ('start' | 'destination' | 'auto')
  const [mapSelectionMode, setMapSelectionMode] = useState<'start' | 'destination' | 'auto'>('start');

  // Viva Theory Modal
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);

  // Compute the algorithm result based on start, destination, and selected algorithm
  const algorithmResult: AlgorithmResult = useMemo(() => {
    switch (selectedAlgorithm) {
      case 'bfs':
        return runBFS(startNodeId, destinationNodeId);
      case 'dfs':
        return runDFS(startNodeId, destinationNodeId);
      case 'dijkstra':
      default:
        return runDijkstra(startNodeId, destinationNodeId);
    }
  }, [startNodeId, destinationNodeId, selectedAlgorithm]);

  // Total steps in the execution trace
  const totalSteps = algorithmResult.steps.length;

  // Active step data
  const currentStepData: AlgorithmStep | undefined =
    algorithmResult.steps[currentStepIndex] ||
    algorithmResult.steps[totalSteps - 1];

  // Auto-play timer effect
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && isVisualizing) {
      if (currentStepIndex < totalSteps - 1) {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
        }, playbackSpeed);
      } else {
        // Reached end of animation
        setIsPlaying(false);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, isVisualizing, currentStepIndex, totalSteps, playbackSpeed]);

  // Instant Run: Go immediately to the completed final step
  const handleRunInstant = useCallback(() => {
    setIsVisualizing(true);
    setIsPlaying(false);
    setCurrentStepIndex(totalSteps - 1);
  }, [totalSteps]);

  // Step-by-Step Visualization: Start from step 0 and begin playback
  const handleStartVisualization = useCallback(() => {
    setIsVisualizing(true);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  }, []);

  // Handlers for step controls
  const handlePlay = useCallback(() => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, totalSteps]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleNextStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const handlePrevStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleJumpToStep = useCallback((index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
  }, [totalSteps]);

  // Reset all
  const handleReset = useCallback(() => {
    setIsVisualizing(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Swap start & destination
  const handleSwapLocations = useCallback(() => {
    setStartNodeId(destinationNodeId);
    setDestinationNodeId(startNodeId);
    setIsVisualizing(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, [destinationNodeId, startNodeId]);

  // Map node click selection
  const handleNodeClickOnMap = useCallback(
    (nodeId: CampusNodeId) => {
      if (mapSelectionMode === 'start') {
        setStartNodeId(nodeId);
        setMapSelectionMode('destination');
      } else {
        setDestinationNodeId(nodeId);
        setMapSelectionMode('start');
      }
      setIsVisualizing(false);
      setIsPlaying(false);
      setCurrentStepIndex(0);
    },
    [mapSelectionMode]
  );

  // Compute metrics for stats dashboard
  const totalLocations = Object.keys(CAMPUS_NODES).length;
  const totalConnections = CAMPUS_EDGES.length;
  const totalNetworkDistance = CAMPUS_EDGES.reduce((sum, e) => sum + e.distance, 0);

  // Highlighting states for the SVG Campus Map based on current step
  const activeCurrentNode = isVisualizing ? currentStepData?.currentNodeId || null : null;
  const activeVisitedNodes = isVisualizing
    ? currentStepData?.visitedNodes || []
    : algorithmResult.pathFound
    ? algorithmResult.path
    : [];
  const activeQueueOrStackNodes = isVisualizing
    ? selectedAlgorithm === 'bfs'
      ? currentStepData?.queueState || []
      : selectedAlgorithm === 'dfs'
      ? currentStepData?.stackState || []
      : []
    : [];
  const activePathNodes =
    !isVisualizing || currentStepData?.finalPathNodes
      ? algorithmResult.path
      : [];
  const activePathEdges =
    !isVisualizing || currentStepData?.finalPathEdges
      ? algorithmResult.pathEdges
      : [];
  const activeExploredEdges = isVisualizing
    ? currentStepData?.exploredEdges || []
    : algorithmResult.pathEdges;

  return (
    <div id="smart-campus-navigation-app" className="min-h-screen bg-slate-100/60 font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <CampusHeader
        onOpenVivaModal={() => setIsVivaModalOpen(true)}
        onResetAll={handleReset}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Top Campus Statistics Dashboard */}
        <CampusStats
          totalLocations={totalLocations}
          totalConnections={totalConnections}
          totalNetworkDistance={totalNetworkDistance}
          selectedAlgorithm={selectedAlgorithm}
          nodesVisitedCount={
            isVisualizing
              ? currentStepData?.visitedNodes.length || 0
              : algorithmResult.nodesVisitedCount
          }
          pathDistance={algorithmResult.pathFound ? algorithmResult.totalDistance : null}
        />

        {/* Main Grid: Campus Map & Control Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Campus Map & Step Playback Controls (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Interactive Campus Map Canvas */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between px-2 pt-1 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Interactive Campus Blueprint
                  </h2>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    (Click any building to select)
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-500">
                  Scale: 1m = 1 unit
                </div>
              </div>

              <CampusMap
                startNodeId={startNodeId}
                destinationNodeId={destinationNodeId}
                currentNodeId={activeCurrentNode}
                visitedNodes={activeVisitedNodes}
                queueOrStackNodes={activeQueueOrStackNodes}
                pathNodes={activePathNodes}
                pathEdges={activePathEdges}
                exploredEdges={activeExploredEdges}
                onSelectNode={handleNodeClickOnMap}
                selectionMode={mapSelectionMode}
                onSetSelectionMode={setMapSelectionMode}
              />
            </div>

            {/* Step-by-Step Visualization Playback Controller (Shows during visualization) */}
            {isVisualizing && (
              <StepControls
                currentStepIndex={currentStepIndex}
                totalSteps={totalSteps}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                currentStepData={currentStepData}
                onPlay={handlePlay}
                onPause={handlePause}
                onNextStep={handleNextStep}
                onPrevStep={handlePrevStep}
                onJumpToStep={handleJumpToStep}
                onReset={handleReset}
                onChangeSpeed={setPlaybackSpeed}
              />
            )}
          </div>

          {/* Right Column: Controls, Results & DSA Inspector (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Location & Algorithm Selection Card */}
            <RouteControls
              startNodeId={startNodeId}
              destinationNodeId={destinationNodeId}
              selectedAlgorithm={selectedAlgorithm}
              onChangeStart={(id) => {
                setStartNodeId(id);
                handleReset();
              }}
              onChangeDestination={(id) => {
                setDestinationNodeId(id);
                handleReset();
              }}
              onSwapLocations={handleSwapLocations}
              onChangeAlgorithm={(algo) => {
                setSelectedAlgorithm(algo);
                handleReset();
              }}
              onRunInstant={handleRunInstant}
              onStartVisualization={handleStartVisualization}
              onReset={handleReset}
              isVisualizing={isVisualizing}
            />

            {/* Route Result Summary Card (Turn-by-turn itinerary) */}
            {(isVisualizing || currentStepData?.finalPathNodes) && (
              <RouteResultCard
                algorithm={selectedAlgorithm}
                pathFound={algorithmResult.pathFound}
                path={
                  isVisualizing && currentStepData?.finalPathNodes
                    ? currentStepData.finalPathNodes
                    : algorithmResult.path
                }
                totalDistance={algorithmResult.totalDistance}
                nodesVisitedCount={
                  isVisualizing
                    ? currentStepData?.visitedNodes.length || 0
                    : algorithmResult.nodesVisitedCount
                }
                startNodeId={startNodeId}
                destinationNodeId={destinationNodeId}
                executionTimeMs={algorithmResult.executionTimeMs}
              />
            )}

            {/* Algorithm Information Panel (Data Structure & Pseudocode Inspector) */}
            <AlgorithmInfoPanel
              algorithm={selectedAlgorithm}
              currentStepData={currentStepData}
              startNodeId={startNodeId}
              destinationNodeId={destinationNodeId}
              pathFound={algorithmResult.pathFound}
              totalPathDistance={
                algorithmResult.pathFound ? algorithmResult.totalDistance : null
              }
            />
          </div>
        </div>
      </main>

      {/* College Viva & DSA Theory Reference Modal */}
      <VivaTheoryModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />
    </div>
  );
}
