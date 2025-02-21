"use client";

import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <ProgressProvider
        height="10px"
        color="#FF7439"
        options={{ showSpinner: true }}
        shallowRouting
      />
      {children}
    </>
  );
};

export default Providers;
