import {
    Blocks,
    Group,
    ScanBarcode,
    Package,
    Users,
} from "lucide-react";


export const navLinks = [
    {
        url: "/",
        icon: <Blocks />,
        label: "Dashboard",
    },
    {
        url: "/collections",
        icon: <Group />,
        label: "Collections",
    },
    {
        url: "/products",
        icon: <ScanBarcode />,
        label: "Products",
    },
    // {
    //     url: "/orders",
    //     icon: <Package />,
    //     label: "Orders",
    // },
    // {
    //     url: "/customers",
    //     icon: <Users />,
    //     label: "Customers",
    // },
];