
import React from "react";
import Nav from '../component/Nav'
import AnimatedBG from '../component/AnimatedBG'
import ai from "../assets/ai.png";
import { SiViaplay } from "react-icons/si";
import Logos from "../component/Logos";
import { motion } from 'framer-motion';
import ExploreCourses from "../component/ExploreCourses";
import CardPage from "../component/CardPage";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="w-[100%] overflow-hidden">
      
      {/* Animated Background with Navigation and Content */}
      <AnimatedBG darkMode={true}>
        <Nav />
        
        {/* Hero Content */}
        <div className="min-h-screen flex items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center px-4"
          >
            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="lg:text-[70px] md:text-[40px] text-[28px] text-white font-bold mb-4"
            >
              Grow Your Skills to Advance
            </motion.h1>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="lg:text-[70px] md:text-[40px] text-[28px] text-white font-bold mb-8"
            >
              Your Career Path
            </motion.h2>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-[20px] py-[10px] border-2 border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 items-center cursor-pointer bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
                onClick={() => navigate("/allcourses")}
              >
                View All Courses
                <SiViaplay className="w-[30px] h-[30px] fill-white" />
              </motion.button>

              {/* AI Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-[20px] py-[10px] bg-white text-black rounded-[10px] text-[18px] font-light flex gap-2 items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
              >
                Search With AI
                <img
                  src={ai}
                  className="w-[30px] h-[30px] rounded-full"
                  alt=""
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedBG>

      {/* Logos Section */}
      <Logos />

      {/* Explore Courses Section */}
      <ExploreCourses />
      <CardPage />

    </div>
  );
}

export default Home;
