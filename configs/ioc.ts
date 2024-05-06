import { asFunction, createContainer } from "awilix";

import dataSource from "@/features/contact/dataSource";
import contactRepository from "@/features/contact/contactRepository";

export interface DI {
  contactRepository: ReturnType<typeof contactRepository>;
  contactDataSource: ReturnType<typeof dataSource>;
}

const container = createContainer<DI>();

container.register({
  contactRepository: asFunction(contactRepository),
  contactDataSource: asFunction(dataSource),
});

export default container;
