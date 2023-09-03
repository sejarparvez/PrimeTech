interface RegistrationValidationProps {
  name: string;
  email: string;
  password: string;
}

export default function RegistrationValidation({
  name,
  email,
  password,
}: RegistrationValidationProps) {
  let errors: {
    name?: string;
    email?: string;
    password?: string;
  } = {};
  if (name.trim() === "") {
    errors.name = "Name is required";
  } else if (name.length < 4) {
    errors.name = "Name must be at least 4 characters";
  }
  if (email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email is invalid";
  }
  if (password.trim() === "") {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
