import z from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(20),
  name: z.string().min(2).max(256),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  birthdate: z.custom<Date>(),
  profileImage: z.custom<File>()
});

export const signUpPart1Schema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(20),
  name: z.string().min(2).max(256),
});

export const signUpPart2Schema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
});

export const signUpPart3Schema = z.object({
  birthdate: z.custom<Date>(),
  profileImage: z.custom<File>()
});
