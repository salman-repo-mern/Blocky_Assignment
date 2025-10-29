
import React from 'react';
import { RoutePoint } from '../types';
import { calculateSpeedKmH } from '../utils/helpers';

interface ControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  resetSimulation: () => void;
  currentPosition: RoutePoint | null;
  currentIndex: number;
  routeData: RoutePoint[];
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  togglePlay,
  resetSimulation,
  currentPosition,
  currentIndex,
  routeData
}) => {
  const speed = calculateSpeedKmH(currentIndex, routeData);

  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="absolute top-4 right-4 z-[1000] p-4 bg-white/90 backdrop-blur-sm shadow-2xl rounded-lg w-full max-w-xs md:max-w-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Vehicle Status</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <div>
          <span className="font-semibold text-gray-700">Coordinates:</span>
          <span className="font-mono text-blue-600 ml-2">
            {currentPosition ? `${currentPosition.lat.toFixed(6)}, ${currentPosition.lng.toFixed(6)}` : 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Timestamp:</span>
          <span className="font-medium text-gray-800 ml-2">
            {currentPosition?.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Speed:</span>
          <span className="font-medium text-green-700 ml-2">{speed} km/h</span>
        </div>
         <div>
          <span className="font-semibold text-gray-700">Progress:</span>
          <span className="font-medium text-gray-800 ml-2">{currentIndex + 1} / {routeData.length}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={togglePlay}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isPlaying ? <PauseIcon/> : <PlayIcon/>}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 shadow-md transition-transform transform hover:scale-105"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Controls;
