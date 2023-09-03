export default function LoginValidation({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const errors: { [key: string]: string } = {};
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
