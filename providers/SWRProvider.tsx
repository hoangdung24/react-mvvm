"use client";

import axios from "axios";
import { PropsWithChildren } from "react";
import { SWRConfig, SWRConfiguration } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const configObject: SWRConfiguration = {
  fetcher,
  refreshInterval: 3000,
};

const Provider = ({ children }: PropsWithChildren) => {
  return <SWRConfig value={configObject}>{children}</SWRConfig>;
};

export default Provider;
