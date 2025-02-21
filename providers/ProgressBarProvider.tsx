"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
    <ProgressBar
      height="4px"
      color="#FF7439"
      options={{ showSpinner: true }}
      shallowRouting
    />
      {children}
    </>
  );
};

export default Providers;
