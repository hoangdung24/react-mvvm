import {
  FormControl as OriginalFormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { FormControlProps } from "@/interfaces/FormControlProps";

const FormControl = (props: FormControlProps) => {
  const { label, fieldName, isReadOnly, isRequired, isDisabled, helperText } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const isError = errors[fieldName] ? true : false;

  const errorMessage = errors[fieldName]?.message;

  return (
    <OriginalFormControl
      isInvalid={isError}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      <FormLabel>{label}</FormLabel>
      <Input {...register(fieldName)} />

      {!isError && helperText && <FormHelperText>{helperText}</FormHelperText>}

      {isError && typeof errorMessage === "string" && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </OriginalFormControl>
  );
};

export default FormControl;
