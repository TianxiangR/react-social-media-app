import { zodResolver } from '@hookform/resolvers/zod';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, Input, TextField, useMediaQuery } from '@mui/material';
import { profile } from 'console';
import React, {useEffect, useRef, useState} from 'react';
import { type ControllerFieldState, type ControllerRenderProps, useForm, type UseFormStateReturn } from 'react-hook-form';
import { set, z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useGlobalContext } from '@/context/GlobalContext';
import { base64StringtoFile, extractImageFileExtensionFromBase64 } from '@/lib/utils';
import { useUpdateProfile } from '@/react-query/queriesAndMutations';
import { User, UserProfile } from '@/types';
import { editProfileSchema, editProfileSchema as formSchema } from '@/validations';

import { Button } from '../ui/button';
import CropImageDialogContent from './CropImageDialogContent';
import CustomDialog from './CustomDialog';
import DatePicker from './DatePicker';
import FormTextArea from './FormTextArea';

function HeaderPhotoFormItem({ header_photo, field }:  {
  header_photo?: string;
  field: ControllerRenderProps<z.infer<typeof formSchema>, 'header_photo'>;
}) {
  const headerImageInputRef = useRef<HTMLInputElement>(null);
  const selectHeaderImage = () => {
    headerImageInputRef.current?.click();
  };
  const [openCropHeader, setOpenCropHeader] = useState(false);
  const [imageData, setImageData] = useState<string | null | undefined>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null | undefined>(header_photo);


  const readDatafromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    field.onChange(file);
    if (file) {
      readDatafromFile(file);
      setOpenCropHeader(true);
    } else {
      console.log('no file');
    }
    e.target.value = '';
  };

  const handleClearImage = () => {
    setImageData(null);
    setOriginalSrc(undefined);
    field.onChange(undefined);
  };

  const onDone = (data: string) => {
    const fileExtention = extractImageFileExtensionFromBase64(data);
    const fileName = `header_photo.${fileExtention}`;
    const file = base64StringtoFile(data, fileName);
    field.onChange(file);
    setImageData(data);
    setOpenCropHeader(false);
  };

  const imageSrc = imageData || originalSrc;
  const diaglogFullScreen = useMediaQuery('@media (max-width:768px)');

  return (
    <FormItem>
      <FormControl>
        <div className="">
          {/* header photo */}
          <div className="bg-[white] w-full aspect-[3/1] relative">
            {
              imageSrc &&
            <img src={imageSrc} alt="profile" className="w-full h-full object-cover"/>
            }
            <div className="top-[50%] left-[50%] absolute flex justify-center items-center" 
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                marginLeft: '-1px'
              }}>
              <div className="flex flex-row gap-3 items-center">
                <button className="p-2.5 black-icon-button" onClick={selectHeaderImage} type="button">
                  <AddAPhotoOutlinedIcon />
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={headerImageInputRef}
                    className="hidden"
                    onChange={onHeaderImageChange}
                  />
                </button>
                { imageSrc &&
                <button className="p-2.5 black-icon-button" onClick={handleClearImage} type="button">
                  <ClearIcon />
                </button>
                }
              </div>
            </div>
          </div>
          <Dialog open={openCropHeader} fullScreen={diaglogFullScreen}>
            { field.value &&
            <CropImageDialogContent 
              imageData={imageData || ''}
              aspectRatio={3/1}
              onDone={onDone}
            />
            }
          </Dialog>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>);
}

function ProfileImageFormItem({ profile_image, field }:  {
  profile_image?: string;
  field: ControllerRenderProps<z.infer<typeof formSchema>, 'profile_image'>;
}){

  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [openCropHeader, setOpenCropHeader] = useState(false);
  const [imageData, setImageData] = useState<string | null | undefined>(null);
  const selectProfileImage = () => {
    profileImageInputRef.current?.click();
  };

  const readDatafromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onProfileImageChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    field.onChange(file);
    if (file) {
      readDatafromFile(file);
      setOpenCropHeader(true);
    } else {
      console.log('no file');
    }
    e.target.value = '';
  };

  const onDone = (data: string) => {
    const fileExtention = extractImageFileExtensionFromBase64(data);
    const fileName = `header_photo.${fileExtention}`;
    const file = base64StringtoFile(data, fileName);
    field.onChange(file);
    setImageData(data);
    setOpenCropHeader(false);
  };

  const imageSrc = imageData || profile_image;
  const diaglogFullScreen = useMediaQuery('@media (max-width:768px)');

  return (
    <FormItem>
      <FormControl>
        <div className="w-full">
          {/* profile image */}
          <div className="p-1 bg-white rounded-full aspect-square w-[20%] mt-[-11%] z-10 relative box-border">
            <img src={imageSrc} alt="avatar" className="w-full h-full rounded-full"/>
            <div className="top-[50%] left-[50%] absolute rounded-full" 
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                transform: 'translate(-50%, -50%)',
                width: 'calc(100% - 0.5rem)',
                height: 'calc(100% - 0.5rem)',
              }}>
              <button 
                className="p-2.5 black-icon-button absolute top-[50%] left-[50%]"
                style={{transform: 'translate(-50%, -50%)'}}
                onClick={selectProfileImage}
                type="button"
              >
                <AddAPhotoOutlinedIcon />
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={profileImageInputRef}
                  className="hidden"
                  onChange={onProfileImageChanged}
                />
              </button>
            </div>
          </div>
          <Dialog open={openCropHeader} fullScreen={diaglogFullScreen}>
            { field.value &&
            <CropImageDialogContent 
              imageData={imageData || ''}
              aspectRatio={1}
              onDone={onDone}
            />
            }
          </Dialog>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>);
}



function EditProfileDialogContent(props: User ) {
  const { header_photo, profile_image, name, bio, location, website, date_of_birth, username} = props;
  const {closeDialog} = useGlobalContext().dialog;
  const { mutateAsync: updateProfile } = useUpdateProfile(username);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      bio: bio || '',
      location: location || '',
      website: website || '',
      month: Number(date_of_birth.split('-')[1]),
      day: Number(date_of_birth.split('-')[2]),
      year: Number(date_of_birth.split('-')[0]),
    },
  });

  const handleOnSuccess = () => {
    closeDialog();
  };
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { month, day, year, profile_image, header_photo, ...rest } = values;
    const date_of_birth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const profile: Partial<UserProfile> = { ...rest, date_of_birth };
    if (profile_image) {
      profile.profile_image = profile_image;
    }

    if (header_photo) {
      profile.header_photo = header_photo;
    }
    updateProfile(profile).then(handleOnSuccess);
  }

  return (
    <div className="overflow-auto w-full lg:w-[600px] lg:h-[600px] relative rounded-lg bg-white" style={{maxHeight: 'calc(100vh - 3rem - 6px)'}}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {/* Top Bar */}
          <div className="flex justify-between top-0 h-[53px] items-center sticky-bar px-2 z-50">
            <div className="flex jusitfy-start items-center">
              <Button
                className="flex justify-center items-center w-fit rounded-full p-2 hover:bg-[#e6e6e7] hover:cursor-pointer bg-transparent text-black"
                onClick={() => {closeDialog();}}
                type="button"
              >
                <CloseIcon />
              </Button>
              <span className="text-lg font-bold ml-2">Edit Profile</span>
            </div>
            <Button className="rounded-full text-sm text-white" type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >Save</Button>
          </div>
          <div className="flex flex-col mb-20">

            <FormField
              control={form.control}
              name="header_photo"
              render={({ field }) => <HeaderPhotoFormItem header_photo={header_photo} field={field} />}
            />
            <div className="flex flex-col px-4 z-10 gap-7">
              <FormField
                control={form.control}
                name="profile_image"
                render={({ field }) => (
                  <ProfileImageFormItem profile_image={profile_image} field={field} />
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextField 
                        {...field}
                        label="Name"
                        variant="outlined"
                        fullWidth
                        sx={{height: '56px'}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextField 
                        {...field}
                        label="Bio"
                        variant="outlined"
                        multiline
                        minRows={3}
                        fullWidth
                      />
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
                    <FormControl>
                      <TextField 
                        {...field}
                        label="Location"
                        variant="outlined"
                        fullWidth
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextField 
                        {...field}
                        label="Website"
                        variant="outlined"
                        fullWidth
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />     
              
              <div className="flex flex-col gap-3">
                <FormDescription>Date of Birth</FormDescription>
                <div className='flex flex-row gap-3'>
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field: {onChange, ...rest} }) => (
                      <FormItem>
                        <FormControl>
                      
                          <TextField 
                            onChange={(e) => onChange(Number(e.target.value))}
                            {...rest}
                            label="Month"
                            variant="outlined"
                            type="number"
                          />
                      
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field: {onChange, ...rest} }) => (
                      <FormItem>
                        <FormControl>
                          <TextField 
                            onChange={(e) => onChange(Number(e.target.value))}
                            {...rest}
                            label="Day"
                            variant="outlined"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field: {onChange, ...rest} }) => (
                      <FormItem>
                        <FormControl>
                          <TextField 
                            onChange={(e) => onChange(Number(e.target.value))}
                            {...rest}
                            label="Year"
                            variant="outlined"
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditProfileDialogContent;