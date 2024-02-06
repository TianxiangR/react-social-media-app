import { zodResolver } from '@hookform/resolvers/zod';
import React, {useEffect,useRef, useState} from 'react';
import { set, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import DatePicker from '@/components/shared/DatePicker';
import ProfileImageSelector from '@/components/shared/ProfileImageSelector';
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
import { signUpPart1Schema, signUpPart2Schema, signUpPart3Schema, signUpSchema } from '@/validations';

function SignUp() {
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [formIndex, setFormIndex] = useState(2);
  const [formData,  setFormData] = useState<z.infer<typeof signUpSchema>>({
    email: '',
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    birthdate: new Date(),
    profileImage: new File([''], 'filename'),
  });

  const form1 = useForm<z.infer<typeof signUpPart1Schema>>({
    resolver: zodResolver(signUpPart1Schema),
    defaultValues: {
      email: formData.email,
      username: formData.username,
      name: formData.name,
    },
  });

  const form2 = useForm<z.infer<typeof signUpPart2Schema>>({
    resolver: zodResolver(signUpPart2Schema),
    defaultValues: {
      password: formData.password,
      confirmPassword: formData.confirmPassword
    },
  });

  const form3 = useForm<z.infer<typeof signUpPart3Schema>>({
    resolver: zodResolver(signUpPart3Schema),
    defaultValues: {
      birthdate: formData.birthdate,
    },
  });

  const handleNext = (value: z.infer<typeof signUpPart1Schema> | z.infer<typeof signUpPart2Schema>) => {
    console.log(value);
    setFormData({...formData, ...value});
    setFormIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setFormIndex((prev) => prev - 1);
  };

  const handleSubmit = (value: z.infer<typeof signUpPart3Schema>) => {
    console.log(value);
    const data = {...formData, ...value};
    setFormData(data);
    console.log(data);

  };
  

  return (
    <div className="flex flex-col w-full ustify-center items-center pt-[50px] pb-[50px] overflow-x-hidden">
      <img 
        src='/assets/icon.png' 
        alt="logo"
        className="rounded-lg"
        width={80}
      />
      <h2 className="h3-bold pt-6">
          Create your account
      </h2>

      <div className="w-[300px] max-w-[300px] overflow-hidden" ref={formContainerRef}>
        <div className="w-[auto] flex" style={{transition: 'all 0.3s ease', transform: `translateX(-${formIndex * 300}px)`}}>
          <div className="min-w-[300px] w-[300px] p-2 flex flex-col">
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(handleNext)} className="flex flex-col gap-3">
                <FormField
                  control={form1.control}
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
                  control={form1.control}
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
                <FormField
                  control={form1.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col w-full pt-6 gap-3">
                  <Button type="submit">
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="min-w-[300px] w-[300px] p-2 flex flex-col">
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(handleNext)} className="flex flex-col gap-3">
                <FormField
                  control={form2.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col w-full pt-6 gap-3">
                  <Button
                    type="button"
                    onClick={() => handleBack()}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button type="submit">
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="min-w-[300px] w-[300px] p-2 flex flex-col">
            <Form {...form3}>
              <form onSubmit={form3.handleSubmit(handleSubmit)} className="flex flex-col gap-3">
                <FormField
                  control={form3.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DatePicker
                          end={new Date()}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form3.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <div className="flex justify-center items-center w-full">
                          <ProfileImageSelector onChange={field.onChange} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col w-full pt-6 gap-3">
                  <Button
                    type="button"
                    onClick={() => handleBack()}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                  >
                    Submit
                  </Button>
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