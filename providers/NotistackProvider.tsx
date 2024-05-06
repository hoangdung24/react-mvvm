"use client";

import { PropsWithChildren } from "react";
import { SnackbarProvider } from "notistack";

const Provider = ({ children }: PropsWithChildren) => {
  return <SnackbarProvider>{children}</SnackbarProvider>;
};

export default Provider;
