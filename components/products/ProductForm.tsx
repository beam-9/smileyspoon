"use client";

import { useEffect, useState } from "react";
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
import MultiSelect from "../custom ui/MultiSelect";
import LoaderComponent from "../custom ui/LoaderComponent";

//form schema and description for collections
const formSchema = z.object({
  title: z.string().min(2).max(25),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
  category: z.string(),
  collections: z.array(z.string()),
  price: z.coerce.number().min(0.1, { message: "Price must be a positive number" }), // .positive validation that it must be of type number, minimum of 0.1 and positive.
  cost: z.coerce.number().min(0.1), //price - costs = profit
});

interface ProductFormProps {
  initialData?: ProductType | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter(); // to route where is redirected on discard click

  //help avoid error of sending POST request on submit.
  const [loading, setLoading] = useState(true);

  const [collections, setCollections] = useState<CollectionType[]>([]); // store collections as an array

  const getCollections = async () => {
    try {
      const response = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await response.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET", err);
      toast.error("Something went wrong. Try again");
    }
  };

  //calling retreiving collections function
  useEffect(() => {
    getCollections();
  }, []);

  //defining form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    //check if there is initial data, if not present the empty strings.
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map(
            (collection) => collection._id
          ),
        }
      : {
          title: "",
          description: "",
          image: "",
          category: "",
          collections: [],
          price: 0.1,
          cost: 0.1,
        },
  });

const handleKeyPress = (
  e:
    | React.KeyboardEvent<HTMLInputElement>
    | React.KeyboardEvent<HTMLTextAreaElement>
) => {
  if(e.key === "Enter"){
    e.preventDefault();
  }
}


  // Updated onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"} `);
        window.location.href = "/products"; // refresh page to update data
        router.push("/products");
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  // Submit handler with client-side validation for price and cost
  const handleSubmitClick = () => {
    const { price, cost } = form.getValues();
    if (price <= 0 || cost <= 0) {
      toast.error("Price and Cost must be positive numbers.");
      return;
    }

    // If validation passes, proceed with form submission
    form.handleSubmit(onSubmit)();
  };

  return loading ? (
    <LoaderComponent />
  ) : (
    <div className="p-10">
      {/* if there is initial data display edit collection */}
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Product</p>
      )}
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
                  <Input placeholder="Title of Product..." {...field} onKeyDown={handleKeyPress}/>
                </FormControl>
                <FormMessage className="text-red-1" />
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
                    placeholder="Description of Product..."
                    {...field}
                    rows={6}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
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
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          {/* first row of form */}
          <div className="md:grid md:grid-cols-2 gap-6">
            {/* price form */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (฿)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Price" {...field} onKeyDown={handleKeyPress}/>
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* cost form */}
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costs (฿)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Costs" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          </div>

          {/*second row of forms*/}
          <div className="md:grid grid-cols-2 gap-6">
            {/* category form */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} onKeyDown={handleKeyPress}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*multi select collection form */}
            {/* if collection > 0 we show */}
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collection"
                        collections={collections} //saving collection as the array we retrieved of existing collections
                        value={field.value}
                        //id to identify collection
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex gap-5">
            <Button type="submit" className="bg-blue-400 text-white" onClick={handleSubmitClick}>
              Submit
            </Button>
            <Button
              type="button"
              className="bg-red-400 text-white"
              onClick={() => router.push("/products")}
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
