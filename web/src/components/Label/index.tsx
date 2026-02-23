import React from "react";

interface LabelProps {
  id: string;
  text: string;
  className?: string;
}

const Label: React.FC<LabelProps> = (props) => {
  const { id, text, className } = props;
  return (
    <div className="mb-0 flex items-center gap-2">
      <label
        htmlFor={`${id}_label`}
        className={`${className} block text-sm leading-6 text-gray-700`}
      >
        {text}
      </label>
    </div>
  );
};

export default Label;
