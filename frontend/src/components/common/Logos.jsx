import React from "react";
import {
  MdCastForEducation,
  MdAttachMoney,
  MdSupportAgent,
  MdGroups,
} from "react-icons/md";

function Logos() {
  const items = [
    {
      icon: <MdCastForEducation />,
      title: "20K+ Online Courses",
      desc: "Learn from industry experts",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <MdAttachMoney />,
      title: "Value for Money",
      desc: "Affordable premium learning",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: <MdSupportAgent />,
      title: "Lifetime Support",
      desc: "We are always here for you",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: <MdGroups />,
      title: "Community Support",
      desc: "Learn with peers & mentors",
      color: "from-orange-500 to-yellow-400",
    },
  ];

  return (
    <div className="w-full py-16 px-6 md:px-12 bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
      
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">
          Why learners choose us 🚀
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Everything you need to upgrade your skills
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="group relative p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-20 blur-2xl transition duration-500 bg-gradient-to-r ${item.color} rounded-2xl`}
            ></div>

            {/* Icon */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-xl text-white text-3xl bg-gradient-to-r ${item.color} shadow-lg mb-4 group-hover:scale-110 transition`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {item.desc}
            </p>

            {/* Hover underline */}
            <div className="w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent transition-all duration-500 mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Logos;