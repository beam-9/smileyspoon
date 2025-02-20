"use client";

import LoaderComponent from '@/components/custom ui/LoaderComponent';
import ProductForm from '@/components/products/ProductForm';
import React, { useEffect, useState } from 'react'

const ProductDetails = ({ params}: { params: { productId: string }}) => {
    const [loading, setLoading] = useState(true)
    const [productDetails, setProductDetails] = useState<ProductType | null>(null)

    const getProductDetails = async () => {
      try {
          const response = await fetch(`/api/products/${params.productId}`, {
              method: "GET"
          })
  
          const data = await response.json()
          //adding the collection's data
          setProductDetails(data)
          setLoading(false)
      } catch (err) {
          console.log("[productId_GET]", err)
      }
    }
    //calling function
    useEffect(() => {
      getProductDetails()
    }, [])
  return loading ? <LoaderComponent /> : (
    <ProductForm initialData={productDetails}/>
  )
}

export default ProductDetails;