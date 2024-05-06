import { useSnackbar } from "notistack";
import { useParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { createStore, useStore } from "zustand";
import { createContext, useContext, useRef } from "react";

import pick from "lodash/pick";

import {
  UpdateProductType,
  UpdateProductReturnType,
  GetUpdateProductForm,
  updateProductSchema,
} from "./UpdateProductSchema";
import GetUpdateProductRepository from "./UpdateProductRepository";

import { FormControlProps } from "@/interfaces/FormControlProps";

type UpdateProductListStore = ReturnType<typeof UpdateProductListStore>;

interface UpdateProductState {
  form: UpdateProductReturnType;
  isLoading: boolean;
  isReady: boolean;
  errorMessage?: string;
  onSubmit: () => Promise<void>;
  loadInitData: () => Promise<void>;
  formFieldConfig: {
    [key in keyof UpdateProductType]: FormControlProps;
  };
}

const UpdateProductListStore = (id: string) => {
  const form = GetUpdateProductForm();
  const { enqueueSnackbar } = useSnackbar();

  const { getProduct, updateProduct } = GetUpdateProductRepository();

  const store = createStore<UpdateProductState>((set, get) => {
    return {
      isLoading: false,
      isReady: false,
      isError: false,
      form,
      formFieldConfig: {
        title: {
          fieldName: "title",
          label: "Tiêu đề",
        },
        description: {
          fieldName: "description",
          label: "Mô tả",
        },
      },
      onSubmit: async () => {
        form.handleSubmit(async (data) => {
          try {
            set({ isLoading: true });

            const selectedData = pick(data, Object.keys(form.formState.dirtyFields));

            const newData = await updateProduct(id, selectedData);

            form.reset(newData);

            enqueueSnackbar({
              message: "Create Successfully",
            });
          } catch (err) {
          } finally {
            set({ isLoading: false });
          }
        })();
      },
      loadInitData: async () => {
        try {
          const product = await getProduct(id);
          const defaultProduct = updateProductSchema.cast(product);
          get().form.reset(defaultProduct);
          set({
            isReady: true,
          });
        } catch (err) {
          set({
            isReady: false,
          });
        }
      },
    };
  });

  return store;
};

const UpdateProductContext = createContext<UpdateProductListStore | null>(null);

const UpdateProductModelView = (Children: () => React.ReactNode) => {
  return function UpdateProductModelView(props: any) {
    const params = useParams<{ id: string }>();
    const store = useRef(UpdateProductListStore(params.id)).current;

    return (
      <UpdateProductContext.Provider value={store}>
        <FormProvider {...store.getState().form}>
          <Children {...props} />
        </FormProvider>
      </UpdateProductContext.Provider>
    );
  };
};

export function useUpdateProduct<T>(selector: (state: UpdateProductState) => T): T {
  const store = useContext(UpdateProductContext);

  if (!store) throw new Error("Missing UpdateProductContext.Provider in the tree");

  return useStore(store, selector);
}

export default UpdateProductModelView;
