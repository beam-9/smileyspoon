"use client";

import CollectionForm from "@/components/collections/CollectionForm";
import LoaderComponent from "@/components/custom ui/LoaderComponent";
import { useEffect, useState } from "react";

const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {
  const [loading, setLoading] = useState(true);
  //the collection is either found or not
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)

  //
  const getCollectionDetails = async () => {
    try {
        const response = await fetch(`/api/collections/${params.collectionId}`, {
            method: "GET"
        })

        const data = await response.json()
        //adding the collection's data
        setCollectionDetails(data)
        setLoading(false)
    } catch (err) {
        console.log("[collectionId_GET]", err)
    }
  }
  //calling function
  useEffect(() => {
    getCollectionDetails()
  }, [])
  //add a loader animation
  return loading ? <LoaderComponent /> : ( 
    <CollectionForm initialData={collectionDetails}/>

  )
};

export default CollectionDetails;
