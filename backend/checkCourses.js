import mongoose from 'mongoose';
import Course from './models/courseModel.js';
import 'dotenv/config';

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const allCourses = await Course.find({});
    console.log(`Total courses in database: ${allCourses.length}`);
    
    const publishedCourses = await Course.find({ isPublished: true });
    console.log(`Published courses: ${publishedCourses.length}`);
    
    if (publishedCourses.length > 0) {
      console.log('Published courses details:');
      publishedCourses.forEach(course => {
        console.log(`- ${course.title} (ID: ${course._id})`);
      });
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkCourses();
