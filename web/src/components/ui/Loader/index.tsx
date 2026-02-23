import React from "react";

interface LoaderProps {
  message?: string | undefined;
  type?: "component" | "page";
  textClass?: string | undefined;
}

const Loader: React.FC<LoaderProps> = (props) => {
  const {
    message,
    type = "page",
    textClass = "text-lg text-white font-light",
  } = props;

  if (type === "component") {
    return (
      <>
        <div className="flex w-full items-center justify-center flex-col gap-2 overflow-y-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-t-4 border-blue-500" />
          <span className={`w-full text-center ${textClass}`}>{message}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 h-screen w-full bg-black bg-opacity-30 backdrop-blur-sm flex flex-col justify-center items-center z-50">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-blue-500 mb-5" />
        <span className={`w-full text-center ${textClass}`}>{message}</span>
      </div>
    </>
  );
};

export default Loader;
