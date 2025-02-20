"use client";

import { useState } from "react";
import { Separator } from "../ui/separator";

//react hook form imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";

//form schema and description for collections
const formSchema = z.object({
  title: z.string().min(2).max(25),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

interface CollectionFormProps {
  //use ? to make it optional, as a new page for collection would mean theres no initial data which would lead to an error.
  initialData?: CollectionType | null;

}

const CollectionForm: React.FC<CollectionFormProps>= ({ initialData }) => {
  const router = useRouter(); // to route where is redirected on discard click

  const params = useParams();

  //help avoid error of sending POST request on submit.
  const [loading, setLoading] = useState(false);

  //defining form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    //check if there is initial data, if not present the empty strings.
    defaultValues: initialData ? initialData : {
          title: "",
          description: "",
          image: "",
        },
  });


  //onsubmit actions
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      //if there is no initial data, we create a new one
      const url = initialData ? `/api/collections/${params.collectionId}` : "/api/collections";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      //if successful add new collection
      if (response.ok) {
        setLoading(false);
        //if there is no initial data, we say its created, but if there was then it was updated
        toast.success(`Collection ${initialData ? "updated" : "created"} `);
        window.location.href = "/collections"; //refresh page, just to ensure data is updated
        router.push("/collections");
      }
    } catch (err) {
      console.log("[collections_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };
  return (
    <div className="p-10">
      {/* if there is initial data display edit collection */}
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Collection</p>
          <Delete id={initialData._id} item="collection"/>
        </div>
      ) : (<p className="text-heading2-bold">Create Collection</p>)}
      <Separator className="bg-grey-1 mt-4 mb-7" />

      {/* building the form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title of Collection..." {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* description form */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description of Collection..."
                    {...field}
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image form */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    // The `value` prop expects an array, so we check if `field.value` exists:
                    // If it does, we wrap it in an array [field.value] (for a single image),
                    // If not, we provide an empty array to signify no image is uploaded yet.
                    value={field.value ? [field.value] : []}
                    // The `onChange` function is triggered when a new image is uploaded.
                    // It passes the uploaded image URL to the field's `onChange` handler,
                    // updating `field.value` with the new URL.
                    onChange={(url) => field.onChange(url)}
                    // The `onRemove` function is triggered when an image is removed.
                    // It clears `field.value` by passing an empty string, indicating no image.
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-5">
            <Button type="submit" className="bg-blue-400 text-white">
              Submit
            </Button>
            {/* redirect back to collections page */}
            <Button
              type="button"
              className="bg-red-400 text-white"
              onClick={() => router.push("/collections")}
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
