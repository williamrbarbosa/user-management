import React from "react";

interface TagProps {
  colorKey: string;
  text: string;
  grid?: boolean;
}

const COLORS = {
  generic: "bg-gray-500 text-white",
  active: "bg-emerald-500 text-white",
  inactive: "bg-red-500 text-white",
} as {
  [key in string]: string;
};

const Tag: React.FC<TagProps> = (props) => {
  const { colorKey, text, grid } = props;
  const tagColor = COLORS[colorKey];

  return (
    <div
      className={`${tagColor} w-full flex justify-center items-center h-auto max-h-6 rounded-sm px-1 ${grid ? "py-0.5" : "py-2"} whitespace-nowrap`}
    >
      <p
        className={`flex items-center text-center inline-block ${grid ? "text-[11px]" : "text-xs"} font-light`}
      >
        {text}
      </p>
    </div>
  );
};

export default Tag;
