import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ComparisonItem, GameAction } from '../types';
import { fetchRandomItem } from '../services/api';

const HIGHSCORE_KEY = 'higher-lower-highscore';

interface GameProps {
  onExit: () => void;
}

const Game = ({ onExit }: GameProps) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentItem, setCurrentItem] = useState<ComparisonItem | null>(null);
  const [nextItem, setNextItem] = useState<ComparisonItem | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCorrect, setShowCorrect] = useState(false);

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGHSCORE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    
    // Cleanup function to clear any animations
    return () => {
      setShowCorrect(false);
    };
  }, []);

  const getRandomItem = async () => {
    return await fetchRandomItem();
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const [first, second] = await Promise.all([getRandomItem(), getRandomItem()]);
      setCurrentItem(first);
      setNextItem(second);
      setScore(0);
      setGameOver(false);
    } catch (error) {
      console.error('Error starting game:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleGuess = async (action: GameAction) => {
    if (!currentItem || !nextItem || loading) return;

    const isCorrect = 
      (action === 'HIGHER' && nextItem.searchVolume >= currentItem.searchVolume) ||
      (action === 'LOWER' && nextItem.searchVolume <= currentItem.searchVolume);

    if (isCorrect) {
      setShowCorrect(true);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        // Save new high score to localStorage
        localStorage.setItem(HIGHSCORE_KEY, newScore.toString());
      }
      
      try {
        const newNext = await getRandomItem();
        // Wait for the correct animation to complete before showing loading state
        const timer = setTimeout(() => {
          setShowCorrect(false);
          setLoading(true);
          // Add a small delay before showing the next item
          const nextTimer = setTimeout(() => {
            setCurrentItem(nextItem);
            setNextItem(newNext);
            setLoading(false);
          }, 100);
          
          // Clear timers if component unmounts
          return () => clearTimeout(nextTimer);
        }, 1000);
        
        // Clear timers if component unmounts
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching next item:', error);
        setLoading(false);
      }
    } else {
      setGameOver(true);
    }
  };

  if (!currentItem || !nextItem) return null;

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto relative">
        {/* Game Container Frame */}
        <div className="absolute inset-0 -m-2 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-3xl transform -skew-y-1 shadow-2xl opacity-75"></div>
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 dark:border-white/10">
          {/* Home Button */}
          <div className="absolute top-6 left-6 z-50">
            <motion.button
              onClick={() => {
                console.log('Home button clicked');
                // Add a small delay to ensure the click is processed
                setTimeout(() => {
                  onExit();
                }, 100);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-5 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 font-semibold cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </motion.button>
          </div>

          {/* Gamified Score Display */}
          {!gameOver ? (
            <div className="flex justify-end items-center mb-8 mt-2 relative z-10 pr-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 dark:from-indigo-600/30 dark:via-purple-600/30 dark:to-pink-600/30 rounded-xl backdrop-blur-sm p-3 border border-white/20 dark:border-gray-700/30 mr-3">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">Score: {score}</span>
                </div>
                <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 dark:from-indigo-600/30 dark:via-purple-600/30 dark:to-pink-600/30 rounded-xl backdrop-blur-sm p-3 border border-white/20 dark:border-gray-700/30">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">Best: {highScore}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center mb-4 mt-16 pt-6">
              <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 dark:from-indigo-600/30 dark:via-purple-600/30 dark:to-pink-600/30 rounded-xl backdrop-blur-sm p-3 border border-white/20 dark:border-gray-700/30">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-lg">Best: {highScore}</span>
              </div>
            </div>
          )}

          {gameOver ? (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-white/20 dark:border-gray-700/30 max-w-lg mx-auto"
              >
                <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                <p className="text-xl text-white/80 mb-4">
                  You scored <span className="font-bold text-yellow-400">{score}</span> points!
                </p>
                <p className="text-white/70 mb-8">
                  {score === 0
                    ? "Better luck next time!"
                    : score <= 3
                    ? "Not bad! Keep practicing!"
                    : score <= 7
                    ? "Great job! You're getting good at this!"
                    : "Amazing! You're a search trends master!"}
                </p>
                <motion.button
                  onClick={startGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-xl mx-2"
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={onExit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-xl mx-2 mt-4"
                >
                  Home
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                {currentItem && (
                  <motion.div
                    key={`current-${currentItem.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl relative group border-2 border-white/50 dark:border-gray-700"
                  >
                    <div className="relative w-full h-96 overflow-hidden border-b-2 border-white/50 dark:border-gray-700">
                      <Image
                        src={currentItem.imageUrl}
                        alt={currentItem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
                    </div>
                    <div className="p-8 relative bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm">
                      <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">{currentItem.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{currentItem.description}</p>
                      <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {currentItem.searchVolume.toLocaleString()} monthly searches
                      </p>
                    </div>
                  </motion.div>
                )}

                {nextItem && (
                  <motion.div
                    key={`next-${nextItem.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl relative group border-2 border-white/50 dark:border-gray-700"
                  >
                    <div className="relative w-full h-96 overflow-hidden border-b-2 border-white/50 dark:border-gray-700">
                      <Image
                        src={nextItem.imageUrl}
                        alt={nextItem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
                    </div>
                    <div className="p-8 relative bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 backdrop-blur-sm">
                      <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">{nextItem.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{nextItem.description}</p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleGuess('HIGHER')}
                          className="flex-1 py-3 px-6 bg-green-500/20 hover:bg-green-500/30 text-white rounded-xl shadow-lg hover:shadow-xl border border-green-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center gap-2 group"
                        >
                          Higher
                          <svg
                            className="w-5 h-5 transform transition-transform group-hover:translate-y-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleGuess('LOWER')}
                          className="flex-1 py-3 px-6 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl shadow-lg hover:shadow-xl border border-red-500/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center gap-2 group"
                        >
                          Lower
                          <svg
                            className="w-5 h-5 transform transition-transform group-hover:translate-y-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                          </svg>
                        </button>
                      </div>
                      <AnimatePresence initial={false} mode="wait">
                        {showCorrect && (
                          <motion.div
                            key="correct-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-green-500/20 backdrop-blur-sm"
                          >
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ type: "spring", duration: 0.7 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="bg-green-500 rounded-full p-4 shadow-xl">
                                <svg
                                  className="w-16 h-16 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5 }}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game; 