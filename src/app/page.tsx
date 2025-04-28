'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Game from '@/components/Game';

export default function HomePage() {
  const [showGame, setShowGame] = useState(false);

  const handleGameExit = () => {
    setShowGame(false);
  };

  return (
    <AnimatePresence mode="wait">
      {!showGame ? (
        <motion.main
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gray-100 dark:bg-[#0A1929] text-gray-800 dark:text-white relative overflow-hidden"
          style={{ zIndex: 0 }}
        >
          {/* Content */}
          <div className="relative z-10">
            <div className="container mx-auto px-4 py-16">
              <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
                >
                  <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 filter drop-shadow-lg">
                    High-Low Hustle
                  </h1>
                  <div className="space-y-4">
                    <p className="text-2xl md:text-3xl text-gray-800 dark:text-white/90 max-w-3xl mx-auto font-medium">
                      Which has more monthly searches on Google?
                    </p>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                      A simple but addictive game of higher or lower. Get it wrong, and it's game over. Get it right, and keep going...
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGame(true)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    PLAY NOW
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                  <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-gray-200/20 dark:border-white/10">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🎯 How To Play</h3>
                    <p className="text-gray-600 dark:text-white/80">Guess whether the next search term has higher or lower monthly searches than the current one.</p>
                  </div>
                  <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-gray-200/20 dark:border-white/10">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🏆 Keep Going</h3>
                    <p className="text-gray-600 dark:text-white/80">Each correct answer adds to your score. How many can you get right in a row?</p>
                  </div>
                  <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-gray-200/20 dark:border-white/10">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🌟 Beat Your Best</h3>
                    <p className="text-gray-600 dark:text-white/80">Try to beat your high score and become a master of search trends!</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.main>
      ) : (
        <motion.div
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <Game onExit={handleGameExit} />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 