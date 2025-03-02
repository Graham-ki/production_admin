'use client';

import { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrdersWithProducts } from '@/app/admin/orders/types';
import { updateOrderStatus } from '@/actions/orders';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from '@/components/ui/calendar';
const supabaseUrl = 'https://kxnrfzcurobahklqefjs.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // Replace with environment variable
const supabase = createClient(supabaseUrl, supabaseKey);

const statusOptions = ['Pending', 'Cancelled', 'Completed'];

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

export default function PageComponent({ ordersWithProducts }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<'Daily' | 'Monthly' | 'Yearly' | 'Custom'>('Daily');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<OrdersWithProducts>(ordersWithProducts);

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
      <h1 className="text-3xl font-bold mb-6 text-center shadow-lg p-4 rounded-lg bg-blue-100 dark:bg-gray-800 dark:text-white">
        Orders Management Dashboard
      </h1>

      {/* FILTER SECTION */}
      <div className="flex space-x-4 mb-6">
        <Button onClick={() => setSelectedFilter('Daily')} variant={selectedFilter === 'Daily' ? 'default' : 'outline'}>
          Daily
        </Button>
        <Button onClick={() => setSelectedFilter('Monthly')} variant={selectedFilter === 'Monthly' ? 'default' : 'outline'}>
          Monthly
        </Button>
        <Button onClick={() => setSelectedFilter('Yearly')} variant={selectedFilter === 'Yearly' ? 'default' : 'outline'}>
          Yearly
        </Button>

        {/* Custom Date Range Picker */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={selectedFilter === 'Custom' ? 'default' : 'outline'}>Custom Date Range</Button>
          </DialogTrigger>
          <DialogContent className="p-4 max-w-[630px]"> {/* Increase max-width to fit both calendars */}
            <DialogHeader>
              <DialogTitle>Select Date Range</DialogTitle>
            </DialogHeader>
            <div className="flex space-x-4 overflow-auto"> {/* Allow horizontal scrolling if needed */}
              <Calendar
                mode="single" // Enable single date selection
                selected={customStartDate}
                onSelect={setCustomStartDate}
                className="rounded-md border" // Add styling to the calendar
              />
      <       Calendar
                mode="single" // Enable single date selection
                selected={customEndDate}
                onSelect={setCustomEndDate}
                className="rounded-md border" // Add styling to the calendar
              />
            </div>
            <Button onClick={() => setSelectedFilter('Custom')} className="mt-4">
              Apply Filter
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table className="transition-shadow duration-300 hover:shadow-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="shadow-md">Order Date</TableHead>
              <TableHead className="shadow-md">Reception Status</TableHead>
              <TableHead className="shadow-md">Delivery Status</TableHead>
              <TableHead className="shadow-md">Marketeer</TableHead>
              <TableHead className="shadow-md">Order ID</TableHead>
              <TableHead className="shadow-md">No. of Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-100 transition-colors duration-200">
                <TableCell>{format(new Date(order.created_at), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{order.receiption_status}</TableCell>
                <TableCell>
                  <Select onValueChange={(value) => updateOrderStatus(order.id, value)} defaultValue={order.status}>
                    <SelectTrigger className="w-[120px] shadow-sm">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
