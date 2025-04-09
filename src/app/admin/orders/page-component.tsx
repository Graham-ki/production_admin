'use client';

import { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrdersWithProducts } from '@/app/admin/orders/types';
import { updateOrderStatus } from '@/actions/orders';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from '@/components/ui/calendar';
import { FiFilter, FiCalendar, FiEye, FiRefreshCw, FiBox, FiTruck, FiUser, FiShoppingBag } from 'react-icons/fi';
import { Badge } from '@/components/ui/badge';

const supabaseUrl = 'https://kxnrfzcurobahklqefjs.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // Replace with environment variable
const supabase = createClient(supabaseUrl, supabaseKey);

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800'
};

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

export default function PageComponent({ ordersWithProducts }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<
    { order_id: number; product: any; quantity: number }[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState<'Daily' | 'Monthly' | 'Yearly' | 'Custom'>('Daily');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<OrdersWithProducts>(ordersWithProducts);
  const [isLoading, setIsLoading] = useState(false);

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
        return orderDate >= startDate! && orderDate <= endDate!;
      });
      setFilteredOrders(filtered);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setIsLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optional: Refresh data or update local state
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <FiShoppingBag className="text-3xl text-indigo-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Orders Management
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setSelectedFilter('Daily')} 
            variant={selectedFilter === 'Daily' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <FiCalendar size={16} />
            Daily
          </Button>
          <Button 
            onClick={() => setSelectedFilter('Monthly')} 
            variant={selectedFilter === 'Monthly' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <FiCalendar size={16} />
            Monthly
          </Button>
          <Button 
            onClick={() => setSelectedFilter('Yearly')} 
            variant={selectedFilter === 'Yearly' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <FiCalendar size={16} />
            Yearly
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant={selectedFilter === 'Custom' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <FiFilter size={16} />
                Custom Range
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FiCalendar />
                  Select Date Range
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col sm:flex-row justify-center gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Start Date</h3>
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    className="rounded-md border shadow"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">End Date</h3>
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    className="rounded-md border shadow"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCustomStartDate(null);
                    setCustomEndDate(null);
                  }}
                >
                  Clear
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedFilter('Custom');
                    filterOrders();
                  }}
                  disabled={!customStartDate || !customEndDate}
                >
                  Apply Filter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
              <FiShoppingBag className="text-indigo-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-xl font-semibold">{filteredOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
              <FiBox className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Products Ordered</p>
              <p className="text-xl font-semibold">
                {filteredOrders.reduce((sum, order) => sum + order.order_items.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <FiTruck className="text-amber-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Shipments</p>
              <p className="text-xl font-semibold">
                {filteredOrders.filter(o => o.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30">
              <FiUser className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unique Customers</p>
              <p className="text-xl font-semibold">
                {new Set(filteredOrders.map(o => o.user_id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="relative overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={16} />
                    Date
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <FiBox size={16} />
                    Products
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <FiUser size={16} />
                    Customer
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <FiTruck size={16} />
                    Status
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Order ID</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(order.created_at), 'MMM dd, yyyy - hh:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <FiBox size={14} />
                        {order.order_items.length} item(s)
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {(order.user as { email?: string })?.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Select 
                        onValueChange={(value) => handleStatusChange(order.id, value)} 
                        value={order.status}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                              {order.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              <Badge className={statusColors[status as keyof typeof statusColors]}>
                                {status}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{order.slug}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() =>
                              setSelectedProducts(
                                order.order_items.map((item) => ({
                                  order_id: order.id,
                                  product: item.product,
                                  quantity: item.quantity,
                                }))
                              )
                            }
                          >
                            <FiEye size={16} />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <FiShoppingBag />
                              Order #{order.slug} Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                                <p>{format(new Date(order.created_at), 'PPpp')}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                                <p>{(order.user as { email?: string })?.email || 'N/A'}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-2">Products</h4>
                              <div className="space-y-3">
                                {selectedProducts.map(({ product, quantity }, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-start gap-4 p-3 border rounded-lg"
                                  >
                                    <div className="flex-1">
                                      <h5 className="font-medium">{product.title}</h5>
                                      <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                                    </div>
                                    <Badge variant="outline">
                                      ${(product.price * quantity).toFixed(2)}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No orders found for the selected filter. Try again later!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
