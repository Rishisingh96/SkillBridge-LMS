import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL ,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async(to, otp) =>{
    await transporter.sendMail({
    from: process.env.USER_EMAIL, // sender address
    to: to, // list of recipients
    subject: "Verify Your Email - SkillBridge LMS", // subject line
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">SkillBridge LMS</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your Learning Journey Starts Here</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: white;">
          <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
          <p style="color: #666; line-height: 1.6;">Thank you for signing up with SkillBridge LMS! Please use the following OTP to verify your email address:</p>
          
          <div style="background-color: #f0f4ff; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center;">This OTP will expire in 5 minutes.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0;">If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px; margin: 0;">© 2024 SkillBridge LMS. All rights reserved.</p>
          <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">Empowering learners worldwide</p>
        </div>
      </div>
    `, // HTML body
  });
}

// Send Welcome Email after account verification
const sendWelcomeEmail = async(to, userName) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "Welcome to SkillBridge LMS! 🎉",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">SkillBridge LMS</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your Learning Journey Starts Here</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
          
          <h2 style="color: #333; margin-top: 0; text-align: center;">Welcome to the Family, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.8; font-size: 16px;">
            Congratulations! Your account has been successfully created and verified. You are now part of the SkillBridge LMS community, where thousands of learners are already achieving their goals.
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: white;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; line-height: 2;">
              <li>📚 Browse our extensive course catalog</li>
              <li>🎯 Enroll in courses that match your interests</li>
              <li> Track your learning progress</li>
              <li>💬 Connect with instructors and fellow learners</li>
              <li>🏆 Earn certificates upon completion</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
              Start Learning Now →
            </a>
          </div>
          
          <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0;">
            <h4 style="margin: 0 0 10px 0; color: #667eea;">📧 Your Account Details</h4>
            <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> Active ✓</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <h4 style="color: #333; margin: 0 0 10px 0;">Need Help?</h4>
            <p style="color: #666; font-size: 14px; margin: 0;">
              Our support team is here to help you 24/7. Reach out to us at 
              <a href="mailto:support@skillbridge.com" style="color: #667eea; text-decoration: none;">support@skillbridge.com</a>
            </p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 14px; margin: 0;">© 2024 SkillBridge LMS. All rights reserved.</p>
          <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">Empowering learners worldwide to achieve their dreams</p>
          
          <div style="margin-top: 20px;">
            <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Privacy Policy</a>
            <span style="color: #ccc;">|</span>
            <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Terms of Service</a>
            <span style="color: #ccc;">|</span>
            <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Contact Us</a>
          </div>
        </div>
      </div>
    `
  });
}

const sendAdminNewUserNotification = async (userData) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: process.env.ADMIN_EMAIL, // admin email .env se
    subject: "🆕 New User Registration - SkillBridge LMS",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New User Registered</h2>

        <p>A new user has created an account on SkillBridge LMS.</p>

        <table border="1" cellpadding="10" cellspacing="0">
          <tr>
            <td><strong>Name</strong></td>
            <td>${userData.name}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>${userData.email}</td>
          </tr>
          <tr>
            <td><strong>Role</strong></td>
            <td>${userData.role}</td>
          </tr>
          <tr>
            <td><strong>Registered At</strong></td>
            <td>${new Date().toLocaleString()}</td>
          </tr>
        </table>

      </div>
    `,
  });
};

// Send Enrollment Confirmation Email
const sendEnrollmentConfirmationEmail = async (to, userName, courseTitle, startDate, endDate) => {
  console.log("=== Enrollment Email Debug ===");
  console.log("To:", to);
  console.log("User Name:", userName);
  console.log("Course Title:", courseTitle);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Email configured:", !!process.env.USER_EMAIL);
  console.log("Password configured:", !!process.env.USER_PASSWORD);
  
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "🎓 Course Enrollment Confirmed - SkillBridge LMS",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">SkillBridge LMS</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Premium Learning Experience</p>
        </div>
        
        <div style="padding: 40px 30px; background-color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
          
          <h2 style="color: #333; margin-top: 0; text-align: center;">Congratulations, ${userName}!</h2>
          
          <p style="color: #666; line-height: 1.8; font-size: 16px; text-align: center;">
            Thank you for enrolling in <strong>${courseTitle}</strong>. You've taken the first step towards mastering new skills!
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin: 30px 0;">
            <h3 style="margin: 0 0 20px 0; color: white; text-align: center;">📚 Course Details</h3>
            
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 16px;"><strong>📖 Course:</strong> ${courseTitle}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 16px;"><strong>🚀 Start Date:</strong> ${startDate}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px;">
              <p style="margin: 0; font-size: 16px;"><strong>⏰ Expiry Date:</strong> ${endDate}</p>
            </div>
          </div>
          
          <div style="background-color: #f0f4ff; border-left: 4px solid #667eea; padding: 25px; margin: 30px 0;">
            <h4 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px;">💡 Best of Luck!</h4>
            <p style="margin: 0; color: #666; line-height: 1.6; font-size: 15px;">
              We're excited to have you on this learning journey. Make the most of this opportunity by staying consistent, asking questions, and engaging with the course material. Remember, every expert was once a beginner!
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
              Start Learning Now →
            </a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <h4 style="color: #333; margin: 0 0 10px 0;">📧 What's Next?</h4>
            <ul style="color: #666; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
              <li>Log in to your dashboard to access the course</li>
              <li>Start with the first module</li>
              <li>Track your progress as you learn</li>
              <li>Earn your certificate upon completion</li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <h4 style="color: #333; margin: 0 0 10px 0;">Need Help?</h4>
            <p style="color: #666; font-size: 14px; margin: 0;">
              Our support team is here to help you 24/7. Reach out to us at 
              <a href="mailto:support@skillbridge.com" style="color: #667eea; text-decoration: none;">support@skillbridge.com</a>
            </p>
          </div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 14px; margin: 0;">© 2024 SkillBridge LMS. All rights reserved.</p>
          <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">Premium Learning Experience - Empowering learners worldwide</p>
          
          <div style="margin-top: 20px;">
            <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Privacy Policy</a>
            <span style="color: #ccc;">|</span>
            <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Terms of Service</a>
            <span style="color: #ccc;">|</span>
            <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Contact Us</a>
          </div>
        </div>
      </div>
    `
  });
  
  console.log("Enrollment email sent successfully to:", to);
};

export default sendMail;
export { sendWelcomeEmail , sendAdminNewUserNotification, sendEnrollmentConfirmationEmail};

