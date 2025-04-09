'use client';

import { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

const statusOptions = ['Pending', 'Completed'];

export default function PageComponent({ ordersWithProducts }: { ordersWithProducts: any[] }) {
  const [selectedProducts, setSelectedProducts] = useState<
    { order_id: number; product: any; quantity: number }[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<'Daily' | 'Monthly' | 'Yearly' | 'Custom'>('Daily');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<any[]>(ordersWithProducts);

  useEffect(() => {
    filterOrders();
  }, [selectedFilter, customStartDate, customEndDate]);

  const filterOrders = () => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (selectedFilter) {
      case 'Daily':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'Monthly':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'Yearly':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case 'Custom':
        startDate = customStartDate;
        endDate = customEndDate;
        break;
      default:
        return;
    }

    if (startDate && endDate) {
      const filtered = ordersWithProducts.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
      setFilteredOrders(filtered);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 p-4 bg-blue-100 dark:bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-bold text-center dark:text-white">
          Orders Management Dashboard
        </h1>
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          onClick={() => setSelectedFilter('Daily')} 
          variant={selectedFilter === 'Daily' ? 'default' : 'outline'}
        >
          Daily
        </Button>
        <Button 
          onClick={() => setSelectedFilter('Monthly')} 
          variant={selectedFilter === 'Monthly' ? 'default' : 'outline'}
        >
          Monthly
        </Button>
        <Button 
          onClick={() => setSelectedFilter('Yearly')} 
          variant={selectedFilter === 'Yearly' ? 'default' : 'outline'}
        >
          Yearly
        </Button>

        {/* Custom Date Range Picker */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={selectedFilter === 'Custom' ? 'default' : 'outline'}>
              Custom Date Range
            </Button>
          </DialogTrigger>
          <DialogContent className="p-4 max-w-[630px]">
            <DialogHeader>
              <DialogTitle>Select Date Range</DialogTitle>
            </DialogHeader>
            <div className="flex space-x-4">
              <Calendar
                mode="single"
                selected={customStartDate}
                onSelect={setCustomStartDate}
                className="rounded-md border"
              />
              <Calendar
                mode="single"
                selected={customEndDate}
                onSelect={setCustomEndDate}
                className="rounded-md border"
              />
            </div>
            <Button onClick={() => setSelectedFilter('Custom')} className="mt-4">
              Apply Filter
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>Reception Status</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Marketeer</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>No. of Products</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{order.receiption_status}</TableCell>
                <TableCell>
                  <Select onValueChange={(value) => updateOrderStatus(order.id, value)} defaultValue={order.status}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue>{order.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{(order.user as { email?: string })?.email || 'N/A'}</TableCell>
                <TableCell>{order.slug}</TableCell>
                <TableCell>{order.order_items.length} item(s)</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedProducts(order.order_items.map(item => ({
                            order_id: order.id,
                            product: item.product,
                            quantity: item.quantity,
                          })))
                        }
                      >
                        View Products
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Products</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {selectedProducts.map(({ product, quantity }, index) => (
                          <div key={index} className="mr-2 mb-2 flex items-center space-x-2">
                            <div className="flex flex-col">
                              <span className="font-semibold">{product.title}</span>
                              <span className="text-sm text-gray-500">Boxes ordered: {quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
