import React from "react";
import Nav from "../../components/navbar/Navbar";
import Videobg from "../../components/common/Videobg";
import ai from "../../assets/ai.png";
import { SiViaplay } from "react-icons/si";
import Logos from "../../components/common/Logos";
import { motion } from "framer-motion";
import ExploreCourses from "../../components/course/ExploreCourses";
import CardPage from "../../components/course/CardPage";
import { useNavigate } from "react-router-dom";
import About from "../../components/common/About";
import Footer from "../../components/common/Footer";
import ReviewPage from "../../components/course/ReviewPage";


function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-900 pt-[68px]">

      {/* HERO SECTION */}
      <Videobg>
        <Nav />

        <div className="min-h-screen flex items-center justify-center text-center px-4">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-bold lg:text-[70px] md:text-[45px] text-[28px]"
            >
              Grow Your Skills to Advance
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white font-bold lg:text-[70px] md:text-[45px] text-[28px] mt-2"
            >
              Your Career Path
            </motion.h2>

            {/* Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >

              {/* Courses Button */}
              <button
                onClick={() => navigate("/allcourses")}
                className="px-6 py-3 border border-white text-white rounded-xl flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
              >
                View All Courses
                <SiViaplay className="text-xl" />
              </button>

              {/* AI Button */}
              <button className="px-6 py-3 bg-white text-black rounded-xl flex items-center gap-2 hover:bg-gray-100 transition">
                Search With AI
                <img src={ai} alt="ai" className="w-6 h-6 rounded-full" />
              </button>

            </motion.div>

          </motion.div>
        </div>
      </Videobg>

      {/* OTHER SECTIONS */}
      <Logos />
      <ExploreCourses />
      <CardPage />
    
      <ReviewPage />
      <About />
      
      <Footer />

    </div>
  );
}

export default Home;