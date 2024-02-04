import z from 'zod';

export const signUpValidation = z.object({
  name: z.string().min(3, { message: 'Too short'}).max(255),
  username: z.string().min(3, { message: 'Too short'}).max(255),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long'}),
}); 

export const signInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long'}),
}); 

export const postValidation = z.object({
  caption: z.string().min(5, { message: 'Too short'}).max(255),
  file: z.custom<File[]>(),
  location: z.string().optional(),
  tags: z.string().optional(),
});