// utils/sendCredentials.js
import emailjs from "emailjs-com";

const sendCredentials = async ({ email, name, username, password }) => {
  const message = `Hello, ${name}\n\nWelcome to MiManuTMS! Your account has been successfully created by the admin.\n\nHere are your credentials:\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}`;
  const subject = "Your MiManuTMS Account Credentials";
  const templateParams = {
    subject: subject,
    to_email: email,
    to_name: name,
    message: message,
  };

  try {
    await emailjs.send(
      "service_wmbofyj", // EmailJS Service ID
      "template_i1hctq8", // EmailJS Template ID
      templateParams,
      "OTKcxW7tWUSp9gqQH" // EmailJS Public Key
    );
  } catch (error) {
    console.error("Error sending credentials email:", error);
  }
};

export default sendCredentials;
