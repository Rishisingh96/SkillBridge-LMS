
import React from "react";
import Nav from '../component/Nav'
import home from '../assets/rishisinghbanner.png'
import ai from "../assets/ai.png";
import { SiViaplay } from "react-icons/si";
import Logos from "../component/Logos";

function Home() {
  return (
    <div className="w-[100%] overflow-hidden">
      
      <div className="w-[100%] lg:h-[140vh] h-[70vh] relative">
        
        <Nav />

        <img
          src={home}
          className="object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh]"
          alt=""
        />

        {/* Heading */}
        <span className="lg:text-[70px] md:text-[40px] text-[20px] absolute lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold">
          Grow Your Skills to Advance
        </span>

        <span className="lg:text-[70px] md:text-[40px] text-[20px] absolute lg:top-[18%] top-[20%] w-[100%] flex items-center justify-center text-white font-bold">
          Your Career Path
        </span>

        {/* Action  Buttons */}
        <div className="absolute lg:top-[30%] md:top-[80%] top-[75%] w-[100%] flex items-center justify-center gap-3 flex-wrap">
          
          <button className="px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[18px] font-light flex gap-2 items-center cursor-pointer">
            View All Courses
            <SiViaplay className="w-[30px] h-[30px] lg:fill-white fill-black" />
          </button>

          {/* AI Search Button */}
          <button className="px-[20px] py-[10px] lg:bg-white bg-black lg:text-black text-white rounded-[10px] text-[18px] font-light flex gap-2 items-center justify-center cursor-pointer">
            Search With AI
            <img
              src={ai}
              className="w-[30px] h-[30px] rounded-full hidden lg:block"
              alt=""
            />
            <img src={ai} className="w-[30px] h-[30px] rounded-full lg:hidden" alt="" />
          </button>

        </div>

      </div>

      <Logos />

    </div>
  );
}

export default Home;
