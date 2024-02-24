import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link , useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { signInUser } from '@/apis';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/AuthContext';
import { useLoginUser } from '@/react-query/queriesAndMutations';
import { signInSchema } from '@/validations';

function Login() {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {mutate: loginUser} = useLoginUser();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

   
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const {email, password} = values;
    loginUser({email, password}, {onSuccess: () => {
      navigate('/home');
    }});
  }

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <Form {...form}>
        <img 
          src='/assets/icon.png' 
          alt="logo"
          className="rounded-lg"
          width={80}
        />
        <h2 className="h3-bold pt-5">
          Log in to your account 
        </h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-[300px] w-full pt-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="pt-3">
            Don&apos;t have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
        </p>
      </Form>
    </div>
  );
}

export default Login;