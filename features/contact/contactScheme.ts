import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UseFormReturn, useForm } from "react-hook-form";

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
});

const CreateContactForm = () => {
  const form = useForm({
    resolver: yupResolver(schema),
  });

  return form;
};

type ContactReturnType = UseFormReturn<(typeof schema)["__outputType"]>;

export { CreateContactForm, type ContactReturnType };
