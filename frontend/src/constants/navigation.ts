export type NavigationItem = {
  label: string;
  href: string;
};

export const corePublicNavItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
];

export const publicNavItems: NavigationItem[] = [
  ...corePublicNavItems,
  { label: "Login", href: "/login" },
];

export const loggedInNavItems: NavigationItem[] = [
  ...corePublicNavItems,
  { label: "User", href: "/user" },
  { label: "Recruiter", href: "/recruiter" },
];

export const resourceMenuItems: NavigationItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact", href: "/contact" },
];
