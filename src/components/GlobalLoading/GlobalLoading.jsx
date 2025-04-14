import { useLottie } from "lottie-react";
import React from "react";
import groovyWalkAnimation from "./loading.json";

const GlobalLoading = () => {
  const options = {
    animationData: groovyWalkAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      {View}
    </div>
  );
};

export default GlobalLoading;
