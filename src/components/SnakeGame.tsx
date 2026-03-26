import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120; // slightly faster for a glitchy feel

interface SnakeGameProps {
  isPlaying: boolean;
  togglePlay: () => void;
  onFoodEaten: () => void;
}

export default function SnakeGame({ isPlaying, togglePlay, onFoodEaten }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    if (!isPlaying) togglePlay();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }
      const newSnake = [newHead, ...prevSnake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
        onFoodEaten();
      } else {
        newSnake.pop();
      }
      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood, onFoodEaten]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (lastDirectionRef.current.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (lastDirectionRef.current.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (lastDirectionRef.current.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (lastDirectionRef.current.x !== -1) setDirection({ x: 1, y: 0 }); break;
        case ' ': e.preventDefault(); togglePlay(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  useEffect(() => {
    if (!gameOver && isPlaying) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [moveSnake, gameOver, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-full max-w-[500px] flex justify-between items-end mb-4 border-b-2 border-cyan-500 pb-2">
        <div className="text-4xl text-cyan-400 uppercase tracking-widest">
          SCORE // {score.toString().padStart(4, '0')}
        </div>
        <div className="text-xl text-magenta-500 animate-pulse">
          [ {gameOver ? 'ERR_CRASH' : isPlaying ? 'EXEC_RUN' : 'SYS_PAUSE'} ]
        </div>
      </div>

      <div className="relative p-2 brutal-border-magenta bg-black">
        <div 
          className="grid bg-[#050505]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(100vw - 4rem, 500px)',
            height: 'min(100vw - 4rem, 500px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border-[0.5px] border-cyan-900/30 ${
                  isSnakeHead ? 'bg-cyan-400 shadow-[0_0_10px_cyan] z-10' : 
                  isSnakeBody ? 'bg-cyan-600/80' : 
                  isFood ? 'bg-magenta-500 shadow-[0_0_15px_magenta] animate-pulse' : ''
                }`}
              />
            );
          })}
        </div>

        {(gameOver || !isPlaying) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 brutal-border-cyan m-2">
            {gameOver ? (
              <div className="text-center p-6 border-2 border-red-500 bg-red-950/30">
                <h2 className="text-6xl text-red-500 mb-4 tracking-widest glitch-effect uppercase" data-text="KERNEL_PANIC">
                  KERNEL_PANIC
                </h2>
                <p className="text-2xl text-red-400 mb-8 font-mono">ERR_CODE: SCORE_{score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-4 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black text-3xl uppercase tracking-widest transition-colors"
                >
                  REBOOT_SYS
                </button>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-cyan-500 bg-cyan-950/30">
                <h2 className="text-7xl text-cyan-400 mb-8 tracking-widest glitch-effect uppercase" data-text="STANDBY">
                  STANDBY
                </h2>
                <button 
                  onClick={togglePlay}
                  className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-3xl uppercase tracking-widest transition-colors"
                >
                  RESUME_EXEC
                </button>
                <p className="mt-6 text-xl text-cyan-600 uppercase tracking-[0.2em]">INPUT: [SPACE]</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="w-full max-w-[500px] mt-4 flex justify-between text-lg text-cyan-600 uppercase tracking-widest">
        <span>[ARROWS] OVERRIDE_VECTOR</span>
        <span>[SPACE] HALT/RESUME</span>
      </div>
    </div>
  );
}
