export interface formContentProps {
  name: string;
  label: string;
  placeholder: string;
  description: string;
}

export const formContent: Array<formContentProps> = [
  {
    name: "Name",
    label: "Name",
    placeholder: "Name",
    description: "Provide your name for contact and identification purposes.",
  },
  {
    name: "Email",
    label: "Email",
    placeholder: "Email",
    description: "Please provide your email address so we can get back to you.",
  },
  {
    name: "Phone",
    label: "Phone",
    placeholder: "Phone",
    description: "Enter your phone number so we can reach you if needed.",
  },
  {
    name: "Organisation",
    label: "Company/Organisation",
    placeholder: "Company",
    description: "Specify the name of your company or organization.",
  }
];

export const messageContent: formContentProps = {
  name: "Message",
  label: "Message",
  placeholder: "Message",
  description: "Compose your message or inquiry here.",
};

export const feedbackContent: formContentProps = {
  name: "Feedback",
  label: "Feedback",
  placeholder: "Feedback",
  description: "Your opinion matters to us. Let us know how we can improve!",
};

interface paymentoptionContentProps extends formContentProps {
  options: Array<string>
}

export const paymentoptionContent : paymentoptionContentProps = {
  name: "Payment",
  label: "Payment",
  placeholder: "Select Payment option",
  description: "Kindly choose your payment option to complete the order.",
  options: [
    "Visa, MasterCard, American Express", 
    "Wire transfer", 
    "PayPal", 
    "Monero",
  ]
}

export const couponContent : formContentProps = {
  name: "Coupon", 
  label: "Coupon", 
  placeholder: "Coupon", 
  description: "Please enter the coupon code you received."
}

export const buttonLabel: string = "Send Message";

export const contactTitle: string = "Contact Us";
