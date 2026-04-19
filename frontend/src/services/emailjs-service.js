import emailjs from '@emailjs/browser';

// These should be replaced with actual values from the user's EmailJS account
const SERVICE_ID = 'service_93ddmrd';
const TEMPLATE_ID = 'template_7cfyzkn';
const PUBLIC_KEY = 'CcrjhReMTk90_5U-O';

export const sendOTPEmail = async (email, otp) => {
  try {
    const templateParams = {
      to_email: email,
      otp_code: otp,
      project_name: 'Mane Made'
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return { success: true, response };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
};
