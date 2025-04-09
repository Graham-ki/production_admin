'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  FiBox, 
  FiLayers, 
  FiCoffee, 
  FiClipboard,
  FiPackage,
  FiGrid,
  FiHome
} from 'react-icons/fi';

export default function LedgerPage() {
  const router = useRouter();

  const stockCards = [
    {
      title: "Materials",
      description: "Track materials used in production",
      icon: <FiBox className="text-blue-500" size={24} />,
      path: "/admin/stock/materials",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Beverage categories",
      description: "Track beverage categories available for sale",
      icon: <FiGrid className="text-purple-500" size={24} />,
      path: "/admin/stock/categories",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      title: "Beverages",
      description: "Add products available in stock",
      icon: <FiCoffee className="text-amber-500" size={24} />,
      path: "/admin/stock/products",
      bgColor: "bg-amber-50 hover:bg-amber-100",
      borderColor: "border-amber-200"
    },
    {
      title: "Beverage specifications",
      description: "Track product specifications, contents and dimensions",
      icon: <FiClipboard className="text-green-500" size={24} />,
      path: "/admin/stock/specifications",
      bgColor: "bg-green-50 hover:bg-green-100",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-center mb-8 gap-3">
        <FiHome className="text-3xl text-indigo-600" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Stock Management
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stockCards.map((card, index) => (
          <Card 
            key={index}
            className={`cursor-pointer ${card.bgColor} border ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-200 group`}
            onClick={() => router.push(card.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                {card.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-white shadow-sm border">
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 group-hover:text-gray-700">
                {card.description}
              </p>
              <div className="mt-4 flex justify-end">
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-600 transition-colors">
                  View details →
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
