
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link , useNavigate } from 'react-router-dom';
import { z } from 'zod';

import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { signInValidation } from '@/lib/validation';


function SignInForm() {
  const { toast } = useToast();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();


  // 1. Define your form.
  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInValidation>) {
    const session = await signInAccount({email: values.email, password: values.password});

    if (!session) {
      toast({
        title: 'Sign in failed. Please try again.',
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      toast({
        title: 'Sign in failed. Please try again.',
      });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo'/>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12" >
          Log in to your account
        </h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>
          Welcome back! Please enter your details
        </p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" 
            className="shad-button_primary">
            {
              isSigningIn ? 
                (<div className='flex-center gap-2'>
                  <Loader/> Loading...
                </div>) : 'Sign In'
            }
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don&lsquo;t have an account?
            <Link to='/sign-up' 
              className='text-primary-500 text-small-semibold ml-1'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SignInForm;

function checkAuthUser() {
  throw new Error('Function not implemented.');
}
