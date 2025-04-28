'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Game from '@/components/Game';

export default function HomePage() {
  const [showGame, setShowGame] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleGameExit = () => {
    setShowGame(false);
  };

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hide scroll indicator when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {!showGame ? (
          <motion.main
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-100 dark:bg-[#0A1929] text-gray-800 dark:text-white relative overflow-hidden"
            style={{ zIndex: 0 }}
          >
            {/* Hero Section - Full Viewport Height */}
            <div className="relative h-screen flex items-center justify-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-4xl mx-auto"
                >
                  <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 filter drop-shadow-lg">
                    High-Low Hustle
                  </h1>
                  <div className="space-y-4 mt-6">
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
                    className="mt-8 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    PLAY NOW
                  </motion.button>
                </motion.div>
                
                {/* Scroll indicator */}
                <AnimatePresence>
                  {showScrollIndicator && (
                    <motion.div 
                      className="absolute left-1/2 transform -translate-x-1/2 bottom-10 mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5 }}
                      style={{ maxWidth: "250px" }}
                    >
                      <motion.button
                        onClick={scrollToContent}
                        className="flex flex-col items-center text-gray-500 dark:text-white/70 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-center w-full"
                        whileHover={{ scale: 1.1 }}
                        animate={{ 
                          y: [0, 10, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <span className="text-align-center items-center justify-center font-medium mb-2 mx-auto">Learn More</span>
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* How to Play Section */}
            <div ref={contentRef} className="container mx-auto px-4 py-20">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                How To Play
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-gray-200/20 dark:border-white/10 shadow-xl">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🎯 How To Play</h3>
                  <p className="text-gray-600 dark:text-white/80">Guess whether the next search term has higher or lower monthly searches than the current one.</p>
                </div>
                <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-gray-200/20 dark:border-white/10 shadow-xl">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🏆 Keep Going</h3>
                  <p className="text-gray-600 dark:text-white/80">Each correct answer adds to your score. How many can you get right in a row?</p>
                </div>
                <div className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-gray-200/20 dark:border-white/10 shadow-xl">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🌟 Beat Your Best</h3>
                  <p className="text-gray-600 dark:text-white/80">Try to beat your high score and become a master of search trends!</p>
                </div>
              </motion.div>
            </div>

            {/* Game Features Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-24">
              <div className="container mx-auto px-4">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Game Features
                </motion.h2>
                
                <div className="max-w-6xl mx-auto">
                  {/* Feature 1 */}
                  <motion.div 
                    className="flex flex-col md:flex-row items-center mb-20 gap-8"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="md:w-1/2">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-64 flex items-center justify-center overflow-hidden">
                        <svg className="w-40 h-40 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Lightning-Fast Gameplay</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Experience quick, addictive gameplay that you can enjoy in short bursts or marathon sessions. Each round presents a new challenge comparing popular search terms.</p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Quick to learn, difficult to master
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Test your knowledge of popular trends
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                  
                  {/* Feature 2 */}
                  <motion.div 
                    className="flex flex-col md:flex-row-reverse items-center mb-20 gap-8"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <div className="md:w-1/2">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-64 flex items-center justify-center overflow-hidden">
                        <svg className="w-40 h-40 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Real Search Data</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Based on actual Google search volume data, discover surprising insights about what people are searching for online.</p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Hundreds of interesting search terms
                        </li>
                        <li className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Learn about trending topics
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Game Preview Section */}
            <div className="container mx-auto px-4 py-24">
              <motion.div 
                className="text-center max-w-3xl mx-auto mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">See It In Action</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">Challenge yourself with these example comparisons. Can you guess which search term has more monthly searches?</p>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, staggerChildren: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Example Card 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">iPhone vs Android</h3>
                      <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Example</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3 text-gray-800 dark:text-white">📱</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">iPhone</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly searches</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-800 dark:text-white">6.1M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3 text-gray-800 dark:text-white">🤖</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Android</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly searches</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-800 dark:text-white">5.5M</span>
                    </div>
                  </div>
                </div>
                
                {/* Example Card 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pizza vs Burger</h3>
                      <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">Example</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3 text-gray-800 dark:text-white">🍕</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Pizza</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly searches</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-800 dark:text-white">2.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3 text-gray-800 dark:text-white">🍔</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Burger</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly searches</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-gray-800 dark:text-white">1.8M</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGame(true)}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Playing Now
                </motion.button>
              </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-900 py-6">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="mb-3 md:mb-0">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">High-Low Hustle</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">A fun game of search volume comparisons</p>
                  </div>
                  <div className="flex space-x-4">
                    <a href="https://x.com/Raghavvv23" className="text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="https://github.com/Raaaghavagrawal/high-low-hustle" className="text-gray-600 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </motion.main>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Game onExit={handleGameExit} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 