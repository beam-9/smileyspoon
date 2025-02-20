"use client"

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
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
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useState } from "react";

//interface is a a TypeScript construct that describes the shape of an object, specifying the names, types, and optional or required status of its properties and methods.
interface DeleteProps {
  id: string;
  item: string,
}

//trash/delete button
const Delete: React.FC<DeleteProps> = ({ item, id }) => {
  
  const[loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true)
      const itemDelete = item === "product" ? "products" : "collections";
      const response = await fetch(`/api/${itemDelete}/${id}`, {
        method: "DELETE",
      })

      //after getting response
      if (response.ok) {
        //refresh the page corresponding to the item deleted.
        setLoading(false)
        toast.success(`${item} deleted`);
        window.location.href = (`${itemDelete}`);
      }
    } catch (err) {
      console.log(err)
      toast.error("An error occured. Please try again.");
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-grey-1">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your {item}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-1 text-white" onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
