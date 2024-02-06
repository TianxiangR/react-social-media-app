import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import React, {useCallback, useState} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';
import ImageCropper from './ImageCropper';

export type SelectImageProps = {
  onChange: (file: File) => void;
  url? : string;
}
function ProfileImageSelector({onChange, url}: SelectImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null | undefined>(url);
  const [open, setOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newFile = acceptedFiles[0];
    setFile(newFile);
    setFileUrl(URL.createObjectURL(newFile));
    onChange(newFile);
    setOpen(true);
  }, [file]);

  const {getRootProps, getInputProps} = useDropzone({
    onDrop, 
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.svg']
    }});

  return (
    <div>
      <div {...getRootProps()} className="hover:cursor-pointer">
        <input {...getInputProps()} />
        {fileUrl ? (
          <div className="w-40 h-40 bg-gray-200 rounded-full flex justify-center items-center flex-col relative">
            <div className="select-image-mask">
              <div className="w-20 h-20 flex justify-center items-center opacity-80">
                <EditIcon sx={{fontSize: '50px', color: 'white', opacity: 100}}/>
              </div>
            </div>
            <img src={fileUrl} alt="profile" className="w-40 h-40 rounded-full object-cover" />
          </div>
        ) : (
          <div className="w-40 h-40 bg-gray-200 rounded-full flex justify-center items-center flex-col relative">
            <AddPhotoAlternateIcon sx={{fontSize: '50px'}}/>
            <span className="text-gray-500">Select an Image</span>
          </div>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>
              Crop the image to fit the profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="p-2 w-full h-[500px] overflow-auto">
            <ImageCropper src={fileUrl || ''} onCrop={(crop) => console.log(crop)} />
          </div>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileImageSelector;