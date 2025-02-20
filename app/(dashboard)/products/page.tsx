"use client";

import { DataTable } from "@/components/custom ui/DataTables";
import LoaderComponent from "@/components/custom ui/LoaderComponent";
import { columns } from "@/components/products/ProductColumn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Products = () => {
  const router = useRouter();

  //loading state set to true initially
  const [loading, setLoading] = useState(true);

  //product state of type ProductType -> initialise as empty array
  const [products, setProducts] = useState<ProductType[]>([]);

  //fetch products from API
  const getProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
      });
      const data = await response.json();

      //update product state with fetched data
      setProducts(data);

      // Set loading state to false as data has been successfully fetched
      setLoading(false);
    } catch (err) {
      console.log("[Products_GET]", err);
    }
  };

  //useffect hook to call the getproduct function
  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    //render loading component whilst data is being fetched
    <LoaderComponent />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Products</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      {/* searchkey for searchbar */}
      <DataTable columns={columns} data={products} searchKey="title" />
    </div>
  );
};

export default Products;
