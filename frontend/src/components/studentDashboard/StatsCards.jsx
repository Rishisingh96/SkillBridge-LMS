import axios from 'axios';
import { BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const StatsCards = () => {

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '12', color: 'bg-blue-500' },
    { icon: Award, label: 'Certificates', value: '5', color: 'bg-green-500' },
    { icon: Clock, label: 'Hours Learned', value: '48', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Completion Rate', value: '85%', color: 'bg-orange-500' },
  ];

  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Fetch Enrollments
  useEffect(()=>{
    const fetchEnrollments = async () =>{
      if(!userData) return;

      setLoadingEnrollments(true);

      try{
        const response = await axios.get(
         
        )
      }
      catch(error){
        console.error('Error fetching enrollments:', error);
      }
      finally{
        setLoadingEnrollments(false);
      }
    }
    fetchEnrollments();
  }, [userData]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3 md:mb-4`}>
              <Icon className="text-white" size={18} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
