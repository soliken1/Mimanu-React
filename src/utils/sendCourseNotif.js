// utils/sendCourseNotif.js
import emailjs from "emailjs-com";

/**
 * Sends a notification email to the user when they are added to a course.
 * @param {Object} param0
 * @param {string} param0.courseId - The ID or name of the course.
 * @param {string} param0.email - The user's email address.
 * @param {string} param0.name - The user's full name.
 */
const sendCourseNotif = async ({ courseId, email, name }) => {
  const subject = "You've Been Enrolled in a Course!";
  const link = `https://mimanu-react.vercel.app/course/${courseId}`;
  const message = `Hello, ${name}!\n\nYou have been successfully enrolled in a new course on MiManuTMS.\n\n📘 Course: ${link}\n\nPlease log in to your account to access the course materials and tasks.\n\nIf you have any questions, feel free to contact your administrator.\n\n- MiManuTMS Team`;

  const templateParams = {
    subject,
    to_email: email,
    to_name: name,
    message,
  };

  try {
    await emailjs.send(
      "service_wmbofyj", // EmailJS Service ID
      "template_i1hctq8", // EmailJS Template ID
      templateParams,
      "OTKcxW7tWUSp9gqQH" // EmailJS Public Key
    );
  } catch (error) {
    console.error("Error sending course notification email:", error);
  }
};

export default sendCourseNotif;
