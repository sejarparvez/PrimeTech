interface Errors {
  name?: string;
}

interface EditProfileValidationProps {
  name: string;
}

function EditProfileValidation({ name }: EditProfileValidationProps): Errors {
  const errors: Errors = {};

  // validate name field
  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.trim().length > 20) {
    errors.name = "Name can not be longer than 20 characters";
  }

  return errors;
}

export default EditProfileValidation;
