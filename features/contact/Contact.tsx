"use client";

import { FormEvent, useCallback } from "react";
import { Button, Container } from "@chakra-ui/react";

import FormControl from "@/compositions/FormControl";
import ContactModelView, { useContact } from "./ContactModelView";

const Contact = () => {
  const onSubmit = useContact((state) => state.onSubmit);
  const isLoading = useContact((state) => state.isLoading);

  const onSubmitCb = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <Container>
      <form onSubmit={onSubmitCb}>
        <FormControl fieldName="title" label="Tiêu đề" />
        <FormControl fieldName="description" label="Mô tả" />
        <Button isLoading={isLoading} type="submit" mt={4}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default ContactModelView(Contact);
