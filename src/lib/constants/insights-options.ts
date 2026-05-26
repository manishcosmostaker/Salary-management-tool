/** Countries and job titles aligned with seed data for consistent insights filters. */

export const INSIGHT_COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "DE", label: "Germany" },
  { code: "IN", label: "India" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "FR", label: "France" },
  { code: "SG", label: "Singapore" },
] as const;

export const INSIGHT_JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "Product Manager",
  "HR Manager",
  "Recruiter",
  "Financial Analyst",
  "Accountant",
  "Sales Representative",
  "Sales Manager",
  "Marketing Specialist",
  "Data Analyst",
  "Data Scientist",
  "Customer Success Manager",
  "Operations Manager",
] as const;
