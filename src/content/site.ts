export const site = {
  name: "JsCreatives",
  shortName: "JSCREATIVES",
  logo: "/jscreatives.webp",
  legalName: "JsCreatives",
  tagline: "Where Brands Stand Out.",
  positioning: "Your Trusted Partner in Printing & Branding.",
  description:
    "JsCreatives is a printing, branding and creative solutions company in Nairobi, Kenya. We help individuals, businesses, organizations and institutions bring their ideas to life through quality printing and professional branding.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://jscreatives.com",
  phone: "+254780237794",
  phoneDisplay: "+254 780 237 794",
  whatsapp: "254780237794",
  whatsappMessage:
    "Hello JsCreatives, I would like to inquire about your printing and branding services.",
  email: "hello@jscreatives.com",
  location: "Nairobi, Kenya",
  locationNote: "Serving clients across Kenya and East Africa.",
  hours: [
    { days: "Monday to Friday", time: "8:00 AM to 6:00 PM" },
    { days: "Saturday", time: "9:00 AM to 4:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  site.whatsappMessage
)}`;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/products", label: "Our Products" },
  { href: "/portfolio", label: "Our Portfolio" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/jscreatives__/",
    handle: "@jscreatives__",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/jscreatives",
    handle: "JsCreatives",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@jscreatives",
    handle: "@jscreatives",
  },
  {
    label: "WhatsApp",
    href: whatsappUrl,
    handle: "+254 780 237 794",
  },
] as const;

export const whyChoose = [
  {
    title: "Quality Assurance",
    description:
      "We prioritise quality in every design, print and branding project, from the first proof to the final finish.",
    icon: "shield",
  },
  {
    title: "Creative Excellence",
    description:
      "We bring ideas to life through considered creative design and professional finishing that stands out.",
    icon: "sparkles",
  },
  {
    title: "Affordable Solutions",
    description:
      "Competitive pricing without compromising on quality, whether you need one item or a full corporate rollout.",
    icon: "value",
  },
  {
    title: "Convenience",
    description:
      "From your first enquiry to final delivery, we keep the process simple and handle the details for you.",
    icon: "convenience",
  },
  {
    title: "Customer Satisfaction",
    description:
      "Your satisfaction is our priority. We listen, advise and refine until the result feels right for your brand.",
    icon: "satisfaction",
  },
  {
    title: "Reliable Delivery",
    description:
      "We value your time and work within agreed timelines so your launch, event or rollout stays on schedule.",
    icon: "delivery",
  },
] as const;

export const coreValues = [
  {
    title: "Creativity",
    description:
      "We look for the idea that makes your brand memorable, then give it a form people can see and touch.",
  },
  {
    title: "Integrity",
    description:
      "We give honest advice, clear quotations and realistic timelines from the first conversation.",
  },
  {
    title: "Quality",
    description:
      "We check materials, colour and finishing at every stage because the details carry your reputation.",
  },
  {
    title: "Professionalism",
    description:
      "Every project is handled with care, clear communication and respect for your brand standards.",
  },
  {
    title: "Reliability",
    description:
      "We do what we say we will do, and we keep you informed until your order is delivered.",
  },
  {
    title: "Customer Satisfaction",
    description:
      "We measure success by how confident you feel recommending us to the next client.",
  },
] as const;

export const homeProcess = [
  {
    step: "01",
    title: "Make an Enquiry",
    description:
      "Tell us what you want printed or branded, the quantity you need and when you need it.",
  },
  {
    step: "02",
    title: "Get a Quote",
    description:
      "We assess your requirements and send a clear quotation with the right production options.",
  },
  {
    step: "03",
    title: "Approve Your Design",
    description:
      "We prepare your artwork or product mockup so you can approve every detail before production.",
  },
  {
    step: "04",
    title: "Production & Delivery",
    description:
      "We bring the approved design to life, check the quality and arrange collection or delivery.",
  },
] as const;

export const detailedProcess = [
  {
    step: "01",
    title: "Contact Us",
    description:
      "Send your requirements through WhatsApp, email or the website enquiry form. Share your quantity, preferred colours, artwork and deadline.",
    note: "What to share: product, quantity, colours, artwork, delivery date.",
  },
  {
    step: "02",
    title: "Receive a Quotation",
    description:
      "We assess your needs, recommend the right material and production method, then share an itemised quotation.",
    note: "Most quotations are prepared within one business day.",
  },
  {
    step: "03",
    title: "Design & Approval",
    description:
      "We prepare your artwork or product mockup for approval before production. Nothing goes to print until you confirm.",
    note: "You review placement, colour and sizing before we proceed.",
  },
  {
    step: "04",
    title: "Production",
    description:
      "Once approved and confirmed, we proceed with production using the agreed materials, print method and finishing.",
    note: "We keep you updated at key production stages.",
  },
  {
    step: "05",
    title: "Quality Check & Delivery",
    description:
      "Your order undergoes a quality check before collection or delivery, so you receive exactly what was approved.",
    note: "Collection and delivery options are confirmed with your quotation.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "JsCreatives handled our entire staff uniform rollout, from embroidery to delivery. The finish is excellent and the team kept us updated throughout.",
    name: "Grace M.",
    role: "HR Manager",
    company: "Manufacturing company, Nairobi",
  },
  {
    quote:
      "Our launch merchandise was the talk of the event. The team took a rough idea and turned it into a collection that felt genuinely premium.",
    name: "Brian O.",
    role: "Founder",
    company: "Technology startup, Nairobi",
  },
  {
    quote:
      "The business cards and letterheads gave our office a professional feel overnight. The attention to detail was worth it.",
    name: "Aisha K.",
    role: "Director",
    company: "Consulting firm, Westlands",
  },
  {
    quote:
      "They branded our conference from the backdrop to the lanyards. Everything matched, arrived on time and looked sharp.",
    name: "Peter N.",
    role: "Events Lead",
    company: "Professional association, Kenya",
  },
  {
    quote:
      "The non-woven bags and notebooks were exactly what we needed for our awareness campaign. Affordable, well finished and delivered on schedule.",
    name: "Mercy W.",
    role: "Programme Officer",
    company: "Community organisation, Nairobi",
  },
  {
    quote:
      "What stood out was the communication. We always knew where our order was and approved the mockup before production.",
    name: "Daniel K.",
    role: "Operations Manager",
    company: "Hospitality group, Nairobi",
  },
] as const;

export const stats = [
  { value: "7", label: "Product categories" },
  { value: "6", label: "Core services" },
  { value: "1", label: "Studio, end to end" },
  { value: "100%", label: "Artwork checked" },
] as const;

export const socialGallery = [
  {
    image: "/images/brand/work-orbit-tech.jpg",
    caption: "Launch merchandise for Orbit Tech",
  },
  {
    image: "/images/brand/work-nova-athletics.jpg",
    caption: "Team kit for Nova Athletics",
  },
  {
    image: "/images/brand/work-kiri-coffee.jpg",
    caption: "Retail packaging for Kiri Coffee",
  },
  {
    image: "/images/brand/merch-notebook.jpg",
    caption: "Branded notebooks in production",
  },
  {
    image: "/images/brand/work-mara-co.jpg",
    caption: "Storefront signage for Mara & Co.",
  },
  {
    image: "/images/brand/merch-tee.jpg",
    caption: "Custom T-shirt branding",
  },
] as const;
