export type CountrySalaryInsights = {
  country: string;
  minSalary: number | null;
  maxSalary: number | null;
  averageSalary: number | null;
  employeeCount: number;
};

export type CountryJobTitleSalaryInsights = {
  country: string;
  jobTitle: string;
  minSalary: number | null;
  maxSalary: number | null;
  averageSalary: number | null;
  employeeCount: number;
};
