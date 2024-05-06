import * as yup from "yup";
import { InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UseFormReturn, useForm } from "react-hook-form";

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
});
const GetUpdateProductForm = (defaultValues?: any) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return form;
};

// type UpdateProductReturnType = UseFormReturn<(typeof schema)["__outputType"]>;
type UpdateProductType = InferType<typeof schema>;
type UpdateProductReturnType = UseFormReturn<UpdateProductType>;

export {
  GetUpdateProductForm,
  type UpdateProductReturnType,
  type UpdateProductType,
  schema as updateProductSchema,
};
