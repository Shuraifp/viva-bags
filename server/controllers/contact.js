import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

export const contactUs = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `"VIVABAGS Contact Form" <${process.env.EMAIL_FROM}>`,
      to: "msharraf258@gmail.com",
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>👜 New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr />
          <p style="color: #666; font-size: 12px;">This message was sent from your eCommerce VIVABAGS contact form.</p>
        </div>
      `,
    });
    console.log("Contact email sent:", data);
    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }
    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending your message.",
      error: error.message,
    });
  }
};
