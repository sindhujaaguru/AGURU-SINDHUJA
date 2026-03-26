import React, { useState, useCallback } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { TRACKS } from './components/MusicPlayer';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const skipForward = useCallback(() => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const skipBackward = useCallback(() => {
    setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black text-cyan-400 overflow-hidden font-digital selection:bg-magenta-500 selection:text-black">
      {/* CRT Overlays */}
      <div className="absolute inset-0 scanlines pointer-events-none z-50" />
      <div className="absolute inset-[-50%] static-noise pointer-events-none z-40" />
      
      <div className="relative w-full h-full p-4 md:p-8 flex flex-col gap-6 screen-tear z-10">
        {/* Header */}
        <header className="brutal-border-magenta p-4 flex justify-between items-start bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-magenta-500 uppercase glitch-effect" data-text="SYS.OP // CORE">
              SYS.OP // CORE
            </h1>
            <span className="text-xl text-cyan-500 uppercase tracking-[0.5em] mt-2">
              [ NEURAL_LINK_ESTABLISHED ]
            </span>
          </div>
          
          <div className="hidden md:flex flex-col items-end text-xl uppercase tracking-widest">
            <span className="text-magenta-500 animate-pulse">STATUS: UNSTABLE</span>
            <span>MEM_ADDR: 0x00FF2A</span>
            <span>LATENCY: ERR_NaN</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Left Column - Audio & Logs */}
          <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
            <MusicPlayer 
              isPlaying={isPlaying}
              currentTrackIndex={currentTrackIndex}
              togglePlay={togglePlay}
              skipForward={skipForward}
              skipBackward={skipBackward}
            />
            
            <div className="flex-1 brutal-border-cyan p-4 bg-black/80 backdrop-blur-sm overflow-hidden flex flex-col">
              <h2 className="text-2xl text-magenta-500 border-b-2 border-magenta-500 pb-2 mb-4 uppercase tracking-widest">
                TERMINAL_OUTPUT
              </h2>
              <div className="flex-1 overflow-y-auto text-lg space-y-2 opacity-80">
                <p>{'>'} BOOT_SEQUENCE_INIT...</p>
                <p>{'>'} LOADING_SNAKE_PROTOCOL...</p>
                <p>{'>'} INJECTING_AUDIO_STREAMS...</p>
                <p className="text-magenta-500 glitch-effect" data-text="> WARNING: REALITY_FRACTURE_DETECTED">
                  {'>'} WARNING: REALITY_FRACTURE_DETECTED
                </p>
                <p>{'>'} AWAITING_USER_INPUT_</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>

          {/* Right Column - Game */}
          <div className="lg:col-span-8 brutal-border-cyan bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center relative overflow-hidden">
            <SnakeGame 
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              onFoodEaten={skipForward}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
