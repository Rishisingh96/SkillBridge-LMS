import React from "react";
import { MdCastForEducation, MdAttachMoney, MdSupportAgent, MdGroups } from "react-icons/md";

function Logos() {
  return (
    <div className="w-[100vw] min-h-[90px] flex items-center justify-center flex-wrap gap-4 md:mb-[50px]">

      <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]">
        
        <MdCastForEducation className="w-[35px] h-[35px] fill-[#03394b]" />
        
        <span>20k+ Online Courses</span>


      </div>

       <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]">
        
        <MdAttachMoney className="w-[35px] h-[35px] fill-[#03394b]" />
        
        <span>Value for money</span>

      </div>

       <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]">
        
        <MdSupportAgent className="w-[35px] h-[35px] fill-[#03394b]" />
        
        <span>Lifetime Support</span>

      </div>


       <div className="flex items-center justify-center gap-2 px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer text-[#03394b]">
        
        <MdGroups className="w-[35px] h-[35px] fill-[#03394b]" />
        
        <span>Community Support</span>

      </div>

    </div>
  );
}

export default Logos;