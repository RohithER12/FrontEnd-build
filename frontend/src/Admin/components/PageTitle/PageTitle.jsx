import React from "react";




const PageTitle = ({ title }) => {
  return (
   
    <div className="flex items-center justify-center">
    <div className="rounded p-2 bg-gray-950">
      <p className="text-xl font-bold text-black dark:text-gray-500 text-center">
        {title}
      </p>
    </div>
  </div>
   
  );
};

export default PageTitle;
