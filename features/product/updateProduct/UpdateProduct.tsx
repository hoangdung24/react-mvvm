"use client";
import { Button, Container } from "@chakra-ui/react";
import { FormEvent, useCallback, useEffect } from "react";

import FormControl from "@/compositions/FormControl";
import UpdateProductModelView, { useUpdateProduct } from "./UpdateProductModelView";

const UpdateProduct = () => {
  const onSubmit = useUpdateProduct((state) => state.onSubmit);
  const isLoading = useUpdateProduct((state) => state.isLoading);
  const isReady = useUpdateProduct((state) => state.isReady);

  const formFieldConfig = useUpdateProduct((state) => state.formFieldConfig);

  const loadInitData = useUpdateProduct((state) => state.loadInitData);

  useEffect(() => {
    loadInitData();
  }, []);

  const onSubmitCb = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    },
    [onSubmit]
  );

  if (!isReady) return "Loading...";

  return (
    <Container>
      <form onSubmit={onSubmitCb}>
        <FormControl {...formFieldConfig.title} />
        <FormControl {...formFieldConfig.description} />
        <Button isLoading={isLoading} type="submit" mt={4}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default UpdateProductModelView(UpdateProduct);
