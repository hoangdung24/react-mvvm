import { useSnackbar } from "notistack";
import { FormProvider } from "react-hook-form";
import { createStore, useStore } from "zustand";
import { useRef, createContext, useContext } from "react";
import { ContactReturnType, CreateContactForm } from "./contactScheme";

import DI from "@/configs/ioc";

type ContactStore = ReturnType<typeof CreateContactFormStore>;

interface ContactState {
  form: ContactReturnType;
  isLoading: boolean;
  onSubmit: () => Promise<void>;
}

const CreateContactFormStore = () => {
  const form = CreateContactForm();

  const { createContact } = DI.resolve("contactRepository");
  const { enqueueSnackbar } = useSnackbar();

  const store = createStore<ContactState>((set) => {
    return {
      form,
      isLoading: false,
      onSubmit: async () => {
        form.handleSubmit(async (data) => {
          try {
            set({ isLoading: true });

            await createContact(data);

            enqueueSnackbar({
              message: "Create Successfully",
            });
          } catch (err) {
          } finally {
            set({ isLoading: false });
          }
        })();
      },
    };
  });

  return store;
};

const ContactContext = createContext<ContactStore | null>(null);

const ContactModelView = (Children: () => React.ReactNode) => {
  return function ContactModelView(props: any) {
    const store = useRef(CreateContactFormStore()).current;

    return (
      <ContactContext.Provider value={store}>
        <FormProvider {...store.getState().form}>
          <Children {...props} />
        </FormProvider>
      </ContactContext.Provider>
    );
  };
};

export function useContact<T>(selector: (state: ContactState) => T): T {
  const store = useContext(ContactContext);

  if (!store) throw new Error("Missing ContactContext.Provider in the tree");

  return useStore(store, selector);
}

export default ContactModelView;
