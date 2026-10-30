import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[\p{L} .'-]+$/u)
  .refine((value) => (value.match(/\p{L}/gu) ?? []).length >= 2);

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

const phoneSchema = z
  .string()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine(
    (value) =>
      /^(070|080|081|090|091)\d{8}$/.test(value) ||
      /^\+234[1-9]\d{9}$/.test(value)
  );

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: z.string().trim().min(12).max(128),
    terms: z.literal(true),
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().trim().min(1),
  })
  .strict();

export const resetSchema = z
  .object({
    email: emailSchema,
  })
  .strict();
