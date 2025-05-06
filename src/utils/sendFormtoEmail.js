import emailjs from "emailjs-com";

/**
 * Sends a form invitation to the specified email with a given form type.
 * @param {string} email - The recipient's email address.
 * @param {string} formType - The form type to be sent (e.g., "Peer Form" or "Superior Form").
 */
const sendFormToEmail = async ({ email, uid, formType }) => {
  const name = email.split("@")[0];
  const link =
    formType === "Peer Form"
      ? `https://mimanu-react.vercel.app/peer-form?uid=${uid}`
      : `https://mimanu-react.vercel.app/superior-form?uid=${uid}`;

  const subject = `${formType} Evaluation Form`;
  const message = `Hello ${name},\n\nYou have been selected to complete a ${formType} for evaluation.\n\nPlease click the link below to begin:\n\n${link}\n\n`;

  const templateParams = {
    subject,
    to_email: email,
    to_name: name,
    message,
  };

  try {
    await emailjs.send(
      "service_wmbofyj", // Your EmailJS Service ID
      "template_i1hctq8", // Your EmailJS Template ID
      templateParams,
      "OTKcxW7tWUSp9gqQH" // Your EmailJS Public Key
    );
    console.log("Form email sent successfully!");
  } catch (error) {
    console.error("Error sending form email:", error);
  }
};

export default sendFormToEmail;
