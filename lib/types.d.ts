
//defining data type for the data table: Collections ver
type CollectionType = {
    _id: string;
    title: string;
    description: string;
    image: string;
    //products held in array
    products: ProductType[];
}

//defining data type for the data table: Products ver
type ProductType = {
    _id: string;
    title: string;
    description: string;
    image: string; // array of strings
    category: string;
    collections: [CollectionType];
    price: number;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
}