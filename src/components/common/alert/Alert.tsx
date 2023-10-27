import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Adjust the import path based on your project structure.
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function AlertDialogDemo({
  link,
  onDelete,
}: {
  link: string;
  onDelete: () => void;
}) {
  const [cancelClicked, setCancelClicked] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);

  const handleCancelClick = () => {
    setCancelClicked(true);
  };

  const handleContinueClick = () => {
    setContinueClicked(true);
    handleDelete();
  };

  const handleDelete = async (): Promise<void> => {
    try {
      toast.loading("Please wait while we delete your post.");
      const response = await fetch(link, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
        toast.dismiss();
        toast.success("Post deleted successfully");
      } else {
        console.error("Error deleting post");
        toast.error("Error deleting post");
      }
    } catch (error) {
      toast.error("Error deleting post");
      console.error("Error deleting post:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg">
          Delete Post
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelClick}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueClick}>
            Delete Post
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      <ToastContainer position="top-center" autoClose={3000} />
    </AlertDialog>
  );
}
