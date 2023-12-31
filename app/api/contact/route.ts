"use server";

import generateEmail from "@/app/email/contact-template";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import axios from "axios";
import { createTransport } from "nodemailer";
import * as z from "zod";

let csrf_token: string;
const validationSchema = z.object({
  Name: z
    .string()
    .nonempty("Please enter your name.")
    .min(3, { message: "Name must be at least 3 characters." })
    .max(70, { message: "Name must not exceed 70 characters." }),
  Email: z
    .string()
    .email("Please enter a valid email address.")
    .max(255, { message: "Email must not exceed 255 characters." }),
  Phone: z.string().regex(/^\d{10}$/i, "Please enter a valid phone number."),
  Organisation: z
    .string()
    .nonempty("Please enter your organization.")
    .max(160, { message: "Company name must not exceed 160 characters." }),
  Subject: z
    .string()
    .nonempty("Please enter a subject.")
    .max(255, { message: "Subject must not exceed 255 characters." }),
  Message: z
    .string()
    .nonempty("Please enter a message.")
    .max(2000, { message: "Message must not exceed 2000 characters." }),
  recaptchaToken: z.string(),
  theme: z.string(),
});
type validationProps = z.infer<typeof validationSchema>;
export async function GET(request: NextRequest) {
  const token = randomBytes(32).toString("hex");
  csrf_token = token;
  const origin = request.headers.get("Origin");
  const allowedOrigins = [
    `${process.env.NEXT_PUBLIC_APP_URL}`,
    `${process.env.NEXT_PUBLIC_APP_URL_WWW}`,
  ];

  if (origin) {
    if (!allowedOrigins.includes(origin)) {
      return new Response(
        JSON.stringify({ error: true, message: "Invalid Origin" }),
        { status: 403 }
      );
    }
  }

  const referer = request.headers.get("Referer");
  if (
    !referer ||
    !allowedOrigins.some((allowedOrigin) => referer.startsWith(allowedOrigin))
  ) {
    return new Response(
      JSON.stringify({ error: true, message: "Invalid referer" }),
      { status: 403 }
    );
  }
  return new Response(JSON.stringify(csrf_token), {
    status: 200,
    headers: {
      "Set-Cookie": `csrf=${csrf_token}; Path=/; HttpOnly; SameSite=Strict; Secure`,
    },
  });
}

export async function POST(request: NextRequest) {
  const Token = request.cookies.get("csrf");
  if (Token?.value !== csrf_token) {
    return new Response(
      JSON.stringify({ error: true, message: "Tokens dont match" }),
      { status: 401 }
    );
  }
  const data = await request.json();
  try {
    validationSchema.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.errors.map((err) => {
        return {
          code: err.code,
          path: err.path,
          message: err.message,
        };
      });
      return new Response(
        JSON.stringify({
          error: true,
          message: "data validation issue",
          errors: errors,
        }),
        { status: 401 }
      );
    }
  }
  const recaptchaToken = data.recaptchaToken;
  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
      },
    }
  );
  const { success } = response.data;
  const sendMail = async (type: "contact-user" | "contact-owner" | "checkout-transfer" | "checkout-monero") => {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user:
          type === "contact-user"
            ? process.env.NEXT_PUBLIC_CONTACT_EMAIL
            : process.env.NEXT_PUBLIC_CONTACT_EMAIL_OWNER,
        pass:
          type === "contact-user"
            ? process.env.GOOGLE_SMTP_EMAIL
            : process.env.GOOGLE_SMTP_EMAIL_OWNER,
      },
    });
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      to:
        type === "contact-user"
          ? `${data.Email}`
          : process.env.NEXT_PUBLIC_CONTACT_EMAIL,
      subject:
        type === "contact-user"
          ? "Thank you for contacting us!"
          : "New Contact message!",
      html: generateEmail(data, data.theme, type),
    });
  };
  if (success) {
    const validatedData = validationSchema.parse(data);
    sendMail("contact-user");
    sendMail("contact-owner");
    return new Response(
      JSON.stringify({ error: false, message: "message has been sent" }),
      { status: 200 }
    );
  } else {
    return new Response(
      JSON.stringify({ error: true, message: "reCAPTCHA verification failed" }),
      { status: 401 }
    );
  }
}
