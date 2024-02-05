import { zodResolver } from '@hookform/resolvers/zod';
import React, {useEffect,useRef, useState} from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import DatePicker from '@/components/shared/DatePicker';
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
import { signUpPart1Schema } from '@/validations';

function SignUp() {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [formSize, setFormSize] = useState<number>(0);

  useEffect(() => {
    if (formContainerRef.current) {
      setFormSize(formContainerRef.current.clientWidth);
    }
  }, [formContainerRef]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpPart1Schema>>({
    resolver: zodResolver(signUpPart1Schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: new Date(),
    },
  });
   
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signUpPart1Schema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex flex-col w-full ustify-center items-center pt-[50px] pb-[50px]">
      <img 
        src='/assets/icon.png' 
        alt="logo"
        className="rounded-lg"
        width={80}
      />
      <h2 className="h3-bold pt-5">
          Create your account
      </h2>
      <div className="w-[300px] max-w-[300px] overflow-auto" ref={formContainerRef}>
        <div className="w-[auto] flex">
          <div className="min-w-[300px] w-[300px] pl-2 pr-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-5 pt-3'>
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex flex-col gap-3'>
                  <Button type="button" variant="outline">Back</Button>
                  <Button type="button" className="w-full">Continue</Button>
                </div>
                {/* <Button type="submit" className="w-full">Sign up</Button> */}
              </form>


            </Form>
          </div>
          <div className="min-w-[300px] pl-2 pr-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-5 pt-3'>
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />   
                <div className='flex flex-col gap-3'>
                  <Button type="button" variant="outline">Back</Button>
                  <Button type="button" className="w-full">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="min-w-[300px] pl-2 pr-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-5 pt-3'>
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker className="w-full max-w-[300px]" start={new Date(1904, 0, 1)} onChange={field.onChange}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex flex-col gap-3'>
                  <Button type="button" variant="outline">Back</Button>
                  <Button type="button" className="w-full">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <p className="pt-3">
          Already have an account? <Link to="/" className='text-blue-500'>Log in</Link>
      </p>
    </div>
  );
}

export default SignUp;