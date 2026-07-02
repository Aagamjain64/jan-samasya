/**
 * All static UI copy and display options live here (frontend-only data).
 * Dynamic records (problems list, user session) still come from the API.
 */

export const routes = {
  home: '/home',
  about: '/aboutus',
  contact: '/contact',
  problems: '/problems',
  create: '/create',
  myProblems: '/my-problems',
  cityWise: '/city-wise',
  signup: '/signup',
  login: '/login',
  registration: '/registration',
  terms: '/terms',
};

export const brand = {
  name: 'Jan Samasya',
  tagline: 'Empowering communities, one problem at a time.',
};

export const landing = {
  badge: 'Citizen-first civic platform',
  title: 'Report local issues. Build better cities.',
  subtitle:
    'Jan Samasya helps residents raise public problems—roads, water, sanitation, power—with clear details and community support.',
  primaryCta: { label: 'Browse problems', path: routes.problems },
  secondaryCta: { label: 'Create account', path: routes.signup },
  tertiaryCta: { label: 'Terms & privacy', path: routes.terms },
  stats: [
    { value: 'City-scoped', label: 'Posts stay relevant to your area' },
    { value: 'Transparent', label: 'Votes surface what matters most' },
    { value: 'Simple', label: 'One flow to report with photo & location' },
  ],
  featureCards: [
    {
      title: 'Post with proof',
      body: 'Add photos and location so issues are easy to verify and act on.',
      icon: '📷',
    },
    {
      title: 'Community voice',
      body: 'Support problems that affect your neighbourhood and track momentum.',
      icon: '🗳️',
    },
    {
      title: 'Stay local',
      body: 'Focus on the streets and services you use every day.',
      icon: '📍',
    },
  ],
};

export const homeMedia = {
  videoEmbedSrc: 'https://www.youtube.com/embed/WDpuAm_KmxU',
  videoTitle: 'Jan Samasya introduction',
  presenterName: 'Aagam Jain',
  headlinePrefix: 'Welcome to Jan Samasya — Presented by',
  description:
    'Raise public issues and support your community by voting on problems that matter to you.',
  submitCta: 'Submit a Problem',
  loginRequiredAlert: 'Please login first to submit a problem!',
  footnote: {
    prefix: 'New here?',
    signup: 'Create an account',
    mid: 'or',
    browse: 'browse problems',
    suffix: '.',
  },
};

export const aboutPage = {
  title: `About ${brand.name}`,
  lead: `${brand.name} is a platform for citizens to report public issues like road damage, water leakage, and cleanliness problems in their city.`,
  featuresHeading: 'Key features',
  features: [
    'Post and track problems in your local area.',
    'Like or dislike problems based on urgency.',
    'Control voting visibility according to your preference.',
  ],
  missionLabel: 'Our mission',
  mission:
    'To connect people and authorities to improve cities — one problem at a time.',
};

export const contactPage = {
  pageTitle: 'Contact us',
  intro:
    'Have questions or facing issues? Reach out using the form below or contact us directly.',
  adminHeading: 'Admin contact',
  admin: {
    phone: '+91 98765 43210',
    email: 'admin@jansamasya.com',
  },
  form: {
    nameLabel: 'Your name',
    emailLabel: 'Email address',
    messageLabel: 'Message',
    submitLabel: 'Send message',
    successAlert: 'Thanks for contacting us!',
  },
};

export const termsPage = {
  title: 'Terms and conditions',
  sections: [
    {
      heading: '1. Acceptance of terms',
      body:
        'By using this platform, you agree to follow these terms and conditions. If you do not accept them, please do not use the service.',
    },
    {
      heading: '2. User responsibilities',
      body:
        'Users must register with valid details. Each user can post and vote only within their registered city. Offensive or fake posts are strictly prohibited.',
    },
    {
      heading: '3. Voting policy',
      body:
        'You can vote once per problem. You may remove your vote (unvote) if needed. Votes are public and help prioritize issues.',
    },
    {
      heading: '4. Privacy',
      body:
        'We do not share your personal information. Your data is secured with industry-standard methods like JWT.',
    },
    {
      heading: '5. Changes',
      body:
        'Terms may be updated without notice. By continuing to use the platform, you agree to the latest version.',
    },
    {
      heading: '6. Governing law',
      body:
        'These terms are governed by the laws of India. Any disputes will be handled in accordance with Indian law.',
    },
  ],
};

export const footerContent = {
  tagline: brand.name,
  links: [
    { label: 'Home', path: routes.home },
    { label: 'About', path: routes.about },
    { label: 'All problems', path: routes.problems },
    { label: 'Terms', path: routes.terms },
  ],
  copyrightName: brand.name,
  social: [
    { label: 'GitHub', href: 'https://github.com/Aagamjain64', icon: 'github' },
    { label: 'Instagram', href: 'https://www.instagram.com/aagamjain_64/', icon: 'instagram' },
    { label: 'Email', href: 'mailto:jaagam412@gmail.com', icon: 'envelope' },
  ],
};

export const navbarContent = {
  links: {
    home: 'Home',
    about: 'About us',
    contact: 'Contact us',
    allProblems: 'All problems',
    createProblem: 'Create problem',
    myProblems: 'My problems',
    cityProblemsSuffix: 'problems',
    signup: 'Sign up',
    signin: 'Sign in',
  },
  searchPlaceholder: 'Search city or problem',
  searchButton: 'Search',
  welcomePrefix: 'Welcome,',
  logout: 'Logout',
};

export const problemFormOptions = {
  categories: [
    { value: '', label: '— Select category —' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Water', label: 'Water' },
    { value: 'Electricity', label: 'Electricity' },
    { value: 'Health', label: 'Health' },
    { value: 'Sanitation', label: 'Sanitation' },
    { value: 'Other', label: 'Other' },
  ],
  urgency: [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ],
  placeholders: {
    customCategory: 'Enter custom category',
    title: 'Problem title',
    description: 'Problem description',
    state: 'State',
    city: 'City',
    pincode: 'Pincode',
  },
  modalTitle: 'Create a problem',
  uploading: 'Uploading image…',
  submit: 'Submit',
  submitWhileUploading: 'Uploading…',
  cancel: 'Cancel',
};

export const authPages = {
  login: {
    title: 'Sign in',
    subtitle: 'Welcome back — continue reporting and tracking issues in your city.',
    username: 'Username',
    password: 'Password',
    usernamePh: 'Enter your username',
    passwordPh: 'Enter your password',
    submit: 'Sign in',
    submitting: 'Signing in…',
    footerPrompt: "Don't have an account?",
    footerLink: 'Create account',
    backHome: 'Back to home',
  },
  signup: {
    title: 'Create account',
    subtitle: 'Join Jan Samasya to report local problems and complete your citizen profile.',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    usernamePh: 'Choose a username',
    emailPh: 'you@example.com',
    passwordPh: 'Create a strong password',
    submit: 'Create account',
    submitting: 'Creating account…',
    footerPrompt: 'Already have an account?',
    footerLink: 'Sign in',
    backHome: 'Back to home',
  },
};
