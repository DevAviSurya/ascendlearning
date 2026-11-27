export const SITE_TITLE = 'Ascend Professional Institute';
export const SITE_DESCRIPTION =
  'Professional training and strategic leadership development in Business Analysis, Project Management, and Leadership & Strategic Management.';

export const TRAINER_NAME = 'Christel Mbonteh';
export const TRAINER_CREDENTIALS = 'Ph.D., PMP';
export const TRAINER_TITLE = 'Founder & Managing Director';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About Trainer' },
  { href: '/courses/', label: 'Programs' },
  { href: '/contact/', label: 'Contact Us' },
] as const;

// Phone number is TBC per client-supplied requirements; leave blank until
// provided rather than publish a placeholder number.
export const CONTACT_PHONE: string = '+1-705-905-5462';
export const CONTACT_EMAIL = 'christel@ascendlearning.courses';

// WhatsApp number for consulting enquiries (client-supplied).
export const CONSULTING_WHATSAPP_DISPLAY = '+1-705-905-5462';
const CONSULTING_WHATSAPP_PREFILL_MESSAGE =
  'Hello, I came across Ascend Professional Institute online and would like to book a free 15-minute consultation. Could you please share the available times?';
export const CONSULTING_WHATSAPP_LINK = `https://wa.me/17059055462?text=${encodeURIComponent(CONSULTING_WHATSAPP_PREFILL_MESSAGE)}`;

export const LINKEDIN_URL = 'https://www.linkedin.com/company/ascend-professional-institue/';

export const PAYMENT_METHODS = ['E-transfer', 'Bank draft', 'EFT'];
export const FEE_PER_COURSE_USD = 750;
export const SEMESTERS = ['Spring', 'Summer', 'Fall', 'Winter'];
