import { z } from "zod";

export const countryParamSchema = z
  .string()
  .trim()
  .length(2, "Country must be a 2-letter ISO code")
  .transform((value) => value.toUpperCase());

export const jobTitleParamSchema = z
  .string()
  .trim()
  .min(1, "Job title is required");
