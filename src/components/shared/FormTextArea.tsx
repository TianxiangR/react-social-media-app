import React from 'react';

import TextArea from './TextArea';


function FormTextArea() {
  return (
    <div>
      <TextArea className="w-full border-[#cfd9de] border-2 focus:outline-blue rounded-lg text-baser h-[40px]" rows={1} />
    </div>
  );
}

export default FormTextArea;