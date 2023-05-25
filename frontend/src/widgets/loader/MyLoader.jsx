import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function MyLoader({ isloading }) {

  return (
    <div className="w-full h-full bg-gray-200 opacity-30 fixed z-10">
      <div className="h-full flex justify-center items-center">
        <ClipLoader
          color={"#020617"}
          loading={isloading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}

MyLoader.displayName = "/src/widgets/loader/MyLoader.jsx";

export default MyLoader;
