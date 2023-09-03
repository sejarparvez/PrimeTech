interface Errors {
  title?: string;
  categories?: string;
  content?: string;
  files?: string;
}

interface Props {
  title: string;
  categories: string;
  content: string;
  files: FileList | null;
}

export default function NewPostValidation({
  title,
  categories,
  content,
  files,
}: Props): Errors {
  const errors: Errors = {};

  // validate title field
  if (!title.trim()) {
    errors.title = "Title is required";
  } else if (title.trim().length < 40) {
    errors.title = "Title must be at least 40 characters long";
  } else if (title.trim().length > 70) {
    errors.title = "Title can not be longer than 70 characters";
  } else if (title.includes("_")) {
    errors.title = "Title cannot contain underscores";
  }

  // validate categories field
  if (!categories || categories.length === 0) {
    errors.categories = "Category is required";
  }

  // validate content field
  if (!content.trim()) {
    errors.content = "Content is required";
  } else if (content.trim().length < 200) {
    errors.content = "Content can not be less than 200 characters";
  }

  // validate image field
  if (!files || files.length === 0) {
    errors.files = "Image is required";
  }

  return errors;
}
