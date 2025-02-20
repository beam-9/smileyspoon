"use client";

import { columns } from "@/components/collections/CollectionColumn";
import { DataTable } from "@/components/custom ui/DataTables";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Collections = () => {
  const router = useRouter();
  //retrieving and finding collections from api
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

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
    }
  };
  //calling function
  useEffect(() => {
    getCollections();
  }, []);

  //returning and rendering the data table
  return (
    <div className="px-10 py-5">
    <div className="flex items-center justify-between">
      <p className="text-heading2-bold">Collections</p>
      <Button className="bg-blue-1 text-white" onClick={() => router.push("/collections/new")}>
        <Plus className="h-4 w-4 mr-2" /> 
        Create Collection
      </Button>
    </div>
      <Separator className="bg-grey-1 my-4"/>
      {/* searchkey for searchbar */}
      <DataTable columns={columns} data={collections} searchKey="title" />
    </div>
  );
};

export default Collections;
