import { zodResolver } from '@hookform/resolvers/zod';
import { Models } from 'appwrite';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

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
import { useCreatePost } from '@/lib/react-query/queriesAndMutations';
import { postValidation } from '@/lib/validation';

import FileUploader from '../shared/FileUploader';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

type PostFormProps = {
  post?: Models.Document;
};

function PostForm({post}: PostFormProps) {
  const { mutateAsync: createPost } = useCreatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();


  // 1. Define your form.
  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post?.caption || '',
      file: [],
      location: post?.tags?.join(',') || ''
    },
  });
   
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postValidation>) {
    const newPost = await createPost({userId: user.id, ...values});
    
    if (!newPost) {
      toast(
        {title: 'Please try again'}
      );
    }
    else {
      toast(
        {title: 'New post created'}
      );
      navigate('/');
    }
  }
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar"  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  mediaUrl={post?.imageUrl || ''}
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Tags (separated by comma &quot; , &quot;)</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  className="shad-input"
                  placeholder='JS, React, TypeScript'
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button 
            type="button"
            className='shad-button_dark_4'
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className='shad-button_primary whitespace-nowrap'
          >
            {post ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;