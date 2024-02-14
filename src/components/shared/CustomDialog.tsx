
import React, { useEffect, useRef } from 'react';

export type CustomDialogProps = React.ComponentProps<'dialog'> & {
  open: boolean;
  fullScreen?: boolean;
}

function CustomDialog({ open, fullScreen, children }: CustomDialogProps) {
  const diaglogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      diaglogRef.current?.showModal();
    }
    else {
      diaglogRef.current?.close();
    }
  }, [open]);

  if (fullScreen) {
    return (
      <dialog className='bg-transparent overflow-hidden' ref={diaglogRef} style={{maxHeight: '100vh', maxWidth: '100vw'}}>
        {children}
      </dialog>
    );
  }

  return (
    <dialog className='dialog w-[600px] bg-transparent overflow-hidden' ref={diaglogRef} style={{maxHeight: 'calc(100vh - 3rem - 6px)'}}>
      {children}
    </dialog>
  );
}

export default CustomDialog;