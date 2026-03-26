import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Terminal } from 'lucide-react';

export const TRACKS = [
  { id: 1, title: "NEON_HORIZON.WAV", artist: "SYNTH_AI", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", color: "#00ffff" },
  { id: 2, title: "CYBER_CITY.WAV", artist: "GLITCH_MIND", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", color: "#ff00ff" },
  { id: 3, title: "DIGITAL_PULSE.WAV", artist: "BYTE_BEATS", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", color: "#ffff00" }
];

interface MusicPlayerProps {
  isPlaying: boolean;
  currentTrackIndex: number;
  togglePlay: () => void;
  skipForward: () => void;
  skipBackward: () => void;
}

export default function MusicPlayer({ isPlaying, currentTrackIndex, togglePlay, skipForward, skipBackward }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    const handleEnded = () => skipForward();
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, skipForward]);

  // Generate ASCII progress bar
  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const asciiProgress = '[' + '#'.repeat(filledLength) + '-'.repeat(barLength - filledLength) + ']';

  return (
    <div className="w-full brutal-border-magenta p-4 bg-black flex flex-col gap-4">
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="border-b-2 border-magenta-500 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-2 text-magenta-500">
          <Terminal size={20} />
          <span className="text-2xl uppercase tracking-widest">AUDIO_SUBSYSTEM</span>
        </div>
        <span className={`text-xl ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-red-500'}`}>
          {isPlaying ? 'ACTIVE' : 'HALTED'}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-3xl uppercase" style={{ color: currentTrack.color }}>
          {'>'} {currentTrack.title}
        </h3>
        <p className="text-xl text-cyan-600">AUTHOR: {currentTrack.artist}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-2xl tracking-widest" style={{ color: currentTrack.color }}>
          {asciiProgress} {Math.floor(progress)}%
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 border-t-2 border-cyan-500 pt-4">
        <button onClick={skipBackward} className="p-2 border-2 border-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors">
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="px-8 py-2 border-2 border-magenta-500 text-magenta-500 hover:bg-magenta-500 hover:text-black transition-colors text-2xl uppercase tracking-widest"
        >
          {isPlaying ? 'PAUSE_EXEC' : 'INIT_PLAY'}
        </button>

        <button onClick={skipForward} className="p-2 border-2 border-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex justify-between text-lg text-cyan-600 mt-2">
        <div className="flex items-center gap-2">
          <Volume2 size={16} />
          <span>VOL: MAX</span>
        </div>
        <span>FREQ: 44.1KHZ</span>
      </div>
    </div>
  );
}
