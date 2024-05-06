import { DI } from "@/configs/ioc";

const contactRepository = ({ contactDataSource }: DI) => {
  return {
    createContact: async (data: any) => {
      return contactDataSource.create(data);
    },
  };
};

export default contactRepository;
