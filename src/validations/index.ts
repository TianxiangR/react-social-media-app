import z from 'zod';

import { publicQueryUser } from '@/apis';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const emailSchema = z.string().email().refine(async (email) => {
  const response = await publicQueryUser({ email });
  console.log(!response?.found);
  return !response?.found ;
}, 'This email is already in use');

const usernameSchema = z.string().min(4).max(20).refine(async (username) => {
  const response = await publicQueryUser({ username });
  return !response?.found;
}, 'This username is already in use');

export const signUpSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  name: z.string().min(2).max(256),
  password: z.string().min(6),
  confirm_password: z.string().min(6),
  date_of_birth: z.string().min(10),
  profile_image: z.custom<File>(),
});

export const signUpPart1Schema = z.object({
  email: emailSchema,
  username: usernameSchema,
  name: z.string().min(2).max(256),
});

export const signUpPart2Schema = z.object({
  password: z.string().min(6),
  confirm_password: z.string().min(6)
}).superRefine(({ password, confirm_password }, ctx) => {
  if (password !== confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirm_password'],
    });
  }
} );

export const signUpPart3Schema = z.object({
  date_of_birth: z.string(),
  profile_image: z.custom<File>(),
});
