import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTotalCollections, getTotalProducts } from "@/lib/actions/actions";
import { Group, ScanBarcode } from "lucide-react";

export default async function Home() {
  const totalCollections = await getTotalCollections();
  const totalProducts = await getTotalProducts();

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5"/>
      {/* creating card objects for total products and collections */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-10">
        {/* Collections card */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Collections Created</CardTitle>
            <Group className="max-sm:hidden"/>
          </CardHeader>
          <CardContent>
            {/* fetching total collections */}
            <p className="text-body-medium">{totalCollections}</p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Products Created</CardTitle>
            <ScanBarcode className="max-sm:hidden"/>
          </CardHeader>
          <CardContent>
            {/* fetching total collections */}
            <p className="text-body-medium">{totalProducts}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
