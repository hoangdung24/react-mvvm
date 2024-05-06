import useSWR, { Key, SWRConfiguration } from "swr";
import { useCallback, useEffect, useRef, useState } from "react";

function useFetch<T, U extends {} = {}>(
  key: Key,
  config: SWRConfiguration = { refreshInterval: 30000 }
) {
  const [url, setUrl] = useState<Key>(key);
  const [data, setData] = useState<T | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [isFirstFetch, setIsFirstFetch] = useState(true);

  const { data: resData, error, isValidating, mutate } = useSWR<T, U>(url, config);

  const prevResData = useRef(resData);

  useEffect(() => {
    if (resData == undefined) return;

    if (prevResData.current == resData) return;

    setData(resData);
    prevResData.current = resData;
    setIsLoading(false);

    if (isFirstFetch) {
      setIsFirstFetch(false);
    }
  }, [resData, isFirstFetch]);

  const refreshData = useCallback(() => {
    mutate();
  }, [mutate]);

  const changeUrl = useCallback((newUrl: Key) => {
    setIsLoading(true);
    setUrl(newUrl);
  }, []);

  return { data, error, isLoading, isValidating, mutate, refreshData, changeUrl };
}

export type UseFetchType<T, U extends {} = {}> = ReturnType<typeof useFetch<T, U>>;

export default useFetch;
