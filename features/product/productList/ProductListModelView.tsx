import React, { createContext, useContext, useEffect, useRef } from "react";

import useFetch, { UseFetchType } from "@/hooks/useFetch";

import {
  Table,
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Avatar, Box } from "@chakra-ui/react";

import { createStore, useStore } from "zustand";

type ProductItemType = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type ContentType = {
  products: ProductItemType[];
  total: number;
  skip: number;
  limit: number;
};

const columnHelper = createColumnHelper<ProductItemType>();

const columns = [
  columnHelper.accessor("id", {
    id: "id",
    cell: (info) => info.renderValue(),
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor("thumbnail", {
    id: "thumbnail",
    header: () => "Hình ảnh",
    cell: (info) => (
      <Box textAlign="center">
        <Avatar src={info.getValue()} />
      </Box>
    ),
  }),
  columnHelper.accessor("title", {
    id: "title",
    header: () => "Tên sản phẩm",
    cell: (info) => (
      <Box as="p" maxWidth={200} isTruncated>
        {info.renderValue()}
      </Box>
    ),
  }),
  columnHelper.accessor((row) => row.description, {
    id: "description",
    header: () => "Mô tả",
    cell: (info) => (
      <Box as="p" maxWidth={300} isTruncated>
        {info.renderValue()}
      </Box>
    ),
  }),
  columnHelper.accessor("brand", {
    id: "brand",
    header: () => "Thương hiệu",
    cell: (info) => (
      <Box as="p" isTruncated>
        {info.renderValue()}
      </Box>
    ),
  }),
  columnHelper.accessor("category", {
    id: "category",
    header: () => "Loại sản phẩm",
    cell: (info) => (
      <Box as="p" isTruncated>
        {info.getValue()}
      </Box>
    ),
  }),
];

interface FilterValue {
  category?: string;
}

interface CreateMergeState {
  storeData: UseFetchType<ContentType>;
  table: Table<ProductItemType>;
  filter: FilterValue;
  setFilter: (newValue: FilterValue, replace?: boolean) => void;
  resetFilter: () => void;
  setIsReady: () => void;
  isReady: boolean;
}

const CreateMergeState = () => {
  const store = createStore<CreateMergeState>((set) => {
    return {
      storeData: {},
      table: undefined,
      filter: {},
      isReady: false,
      setIsReady: () => {
        set({
          isReady: true,
        });
      },
      setFilter: (newValue: any, replace = false) => {
        if (replace) {
          set({ filter: newValue }, true);
        } else {
          set((state) => {
            return {
              filter: {
                ...state.filter,
                ...newValue,
              },
            };
          });
        }
      },
      resetFilter: () => {
        set({ filter: {} }, true);
      },
    } as any as CreateMergeState;
  });
  return store;
};

const AddData = () => {
  const store = useContext(MergeStateContext);
  const URL = "https://dummyjson.com/products/";
  const storeData = useFetch<ContentType>(URL);

  useEffect(() => {
    if (!store) throw new Error("Missing MergeStateContext.Provider in the tree");

    store.setState({
      storeData,
    });
  }, [store, storeData]);

  return null;
};

const AddTable = () => {
  const store = useContext(MergeStateContext);
  const data = useMergeStore((state) => state.storeData?.data);

  const table = useReactTable({
    data: data?.products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!store) throw new Error("Missing MergeStateContext.Provider in the tree");

    store.setState({
      table,
    });
  }, [store, table]);

  return null;
};

const AddFilter = () => {
  const categoryValue = useMergeStore((state) => state.filter.category);
  const changeUrl = useMergeStore((state) => state.storeData.changeUrl);

  useEffect(() => {
    if (categoryValue == undefined) return;

    if (categoryValue) {
      changeUrl(`https://dummyjson.com/products/category/${categoryValue}`);
    } else {
      changeUrl(`https://dummyjson.com/products/`);
    }
  }, [categoryValue, changeUrl]);

  return null;
};

const MergeStateContext = createContext<ReturnType<typeof CreateMergeState> | null>(null);

const ProductListModelView = (Children: () => React.ReactNode) => {
  return function ProductListModelView(props: any) {
    const store = useRef(CreateMergeState()).current;

    useEffect(() => {
      store.getState().setIsReady();
    }, [store]);

    return (
      <MergeStateContext.Provider value={store}>
        <AddData />
        <AddTable />
        <AddFilter />
        <Children {...props} />
      </MergeStateContext.Provider>
    );
  };
};

export function useMergeStore<T>(selector: (state: CreateMergeState) => T): T {
  const store = useContext(MergeStateContext);

  if (!store) throw new Error("Missing MergeStateContext.Provider in the tree");

  return useStore(store, selector);
}

export default ProductListModelView;
