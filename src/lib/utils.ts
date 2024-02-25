import { type ClassValue, clsx } from 'clsx';
import { type PixelCrop } from 'react-image-crop';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysInMonth(year: number, month: number): string[] {
  const date = new Date(year, month, 0);
  const days: string[] = [];
  for (let i = 1; i <= date.getDate(); i++) {
    days.push(i.toString().padStart(2, '0'));
  }
  return days;
}

export function getMonths(): string[] {
  return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
}

export function getYears(start: Date, end: Date): string[] {
  if (start > end) {
    // if the start date is larger than the end date, 
    // return an empty array no matter if they are in the same year or not
    return [];
  }

  const years: string[] = [];
  for (let i = start.getFullYear(); i <= end.getFullYear(); i++) {
    years.push(i.toString());
  }
  return years;
}

export function setCanvasPreview(canvas: HTMLCanvasElement, image: HTMLImageElement, crop: PixelCrop) {
  console.log(crop);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );
    ctx.restore();
  }
}

export function image64ToCanvasRef(canvas: HTMLCanvasElement, image64: string, pixelCrop: PixelCrop){
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = image64;
  
  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
}


export function extractImageFileExtensionFromBase64(base64Data: string){
  return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));
}

export function base64StringtoFile(base64String: string, filename: string) {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mime});
}

export function getFormDataFromObject(object: Record<string, string | Blob | Blob[]>){
  const formData = new FormData();
  for (const key in object){
    if (Array.isArray(object[key])){
      (object[key] as Blob[]).forEach((value) => {
        formData.append(key, value);
      });
    }
    else {
      formData.append(key, object[key] as (string | Blob));
    }
  }
  return formData;
}

export function getQueryStringFromObject(object: Record<string, any>){
  const queryString = Object.keys(object).map(key => `${key}=${object[key]}`).join('&');
  const urlSearchParams = new URLSearchParams(queryString);
  return urlSearchParams.toString();
} 


export const runMicroTask = (function(){
  if (typeof Promise === 'function'){
    return function (callback: () => void){
      Promise.resolve().then(callback);
    };
  }
  if (typeof MutationObserver === 'function'){
    return function (callback: () => void){
      const observer = new MutationObserver(callback);
      const textNode = document.createTextNode('microtask');
      observer.observe(textNode, {characterData: true});
      textNode.data = '';
      textNode.remove();
      return;
    };
  }
  else {
    return function (callback: () => void){
      setTimeout(callback, 0);
    };
  }
})();

export function formatDateString(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  if (now.getFullYear() !== date.getFullYear()){
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('en-US', options).replace(/\//g, '-');
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}

// 
export const multiFormatDateString = (timestamp: string = ''): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
  case Math.floor(diffInDays) >= 30:
    return formatDateString(timestamp);
  case Math.floor(diffInDays) >= 1 && Math.floor(diffInDays) < 30:
    return `${Math.floor(diffInDays)}d`;
  case Math.floor(diffInHours) >= 1:
    return `${Math.floor(diffInHours)}h`;
  case Math.floor(diffInMinutes) >= 1:
    return `${Math.floor(diffInMinutes)}m`;
  default:
    return 'now';
  }
};


export function countNonWhiteSpaceCharacters(text: string) {
  return text.replace(/\s/g, '').length;
} 