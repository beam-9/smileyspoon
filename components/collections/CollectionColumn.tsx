"use client"

import { ColumnDef } from "@tanstack/react-table"
import Delete from "../custom ui/Delete"
import Link from "next/link"

//no need to import type, creating columns for data table.
export const columns: ColumnDef<CollectionType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      //link to redirect to details page of collection selected with the corresponding id
      cell: ({ row }) => (<Link href={`/collections/${row.original._id}`} className="hover:text-red-1">{row.original.title}</Link>)
    },
    {
      accessorKey: "products",
      header: "Products",
      //do length to show num of products in the array
      cell: ({ row }) => <p>{row.original.products.length}</p>
    },
    {
      id: "actions",
      //using item so that the api route can accept multiple inputs, like for product as well
      cell: ({ row }) => <Delete item="collection" id={row.original._id}/>
    },
]
