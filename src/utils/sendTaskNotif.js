// utils/sendTaskNotif.js
import emailjs from "emailjs-com";

/**
 * Sends a task reminder email to a user for a specific task in a course.
 * @param {Object} param0
 * @param {string} param0.courseId - The ID of the course.
 * @param {string} param0.TaskId - The ID of the specific task.
 * @param {string} param0.email - The user's email address.
 * @param {string} param0.name - The user's full name.
 * @param {string} param0.taskTitle - The task's title (for personalization).
 */
const sendTaskNotif = async ({ courseId, TaskId, email, name, taskTitle }) => {
  const subject = "🔔 You Have a Pending Task on MiManuTMS!";
  const link = `https://mimanu-react.vercel.app/course/${courseId}/tasks/${TaskId}`;
  const message = `Hello ${name},\n\nYou have a pending task: "${taskTitle}".\n\nClick below to complete it:\n${link}\n\nDon't forget to finish it before the deadline!\n\n- MiManuTMS Team`;

  const templateParams = {
    subject,
    to_email: email,
    to_name: name,
    message,
  };

  try {
    await emailjs.send(
      "service_wmbofyj",
      "template_i1hctq8",
      templateParams,
      "OTKcxW7tWUSp9gqQH"
    );
  } catch (error) {
    console.error("Error sending task notification email:", error);
  }
};

export default sendTaskNotif;
