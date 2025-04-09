'use client';

import { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusOptions = ['Pending', 'Completed'];

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

export default function PageComponent({ ordersWithProducts }: Props) {
  // ... existing state and logic remains exactly the same ...

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-2xl md:text-3xl font-bold text-center p-3 rounded-lg">
          Orders Management Dashboard
        </h1>
      </Card>

      {/* FILTER SECTION */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setSelectedFilter('Daily')} 
            variant={selectedFilter === 'Daily' ? 'default' : 'outline'}
            className="min-w-[80px]"
          >
            Daily
          </Button>
          <Button 
            onClick={() => setSelectedFilter('Monthly')} 
            variant={selectedFilter === 'Monthly' ? 'default' : 'outline'}
            className="min-w-[80px]"
          >
            Monthly
          </Button>
          <Button 
            onClick={() => setSelectedFilter('Yearly')} 
            variant={selectedFilter === 'Yearly' ? 'default' : 'outline'}
            className="min-w-[80px]"
          >
            Yearly
          </Button>

          {/* Custom Date Range Picker */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant={selectedFilter === 'Custom' ? 'default' : 'outline'}
                className="min-w-[150px]"
              >
                {customStartDate && customEndDate 
                  ? `${format(customStartDate, 'MMM d')} - ${format(customEndDate, 'MMM d')}`
                  : 'Custom Date Range'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle className="text-lg">Select Date Range</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col sm:flex-row gap-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Start Date</p>
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">End Date</p>
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <Button 
                onClick={() => setSelectedFilter('Custom')} 
                className="w-full"
                disabled={!customStartDate || !customEndDate}
              >
                Apply Date Range
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead className="font-semibold">Order Date</TableHead>
              <TableHead className="font-semibold">Reception</TableHead>
              <TableHead className="font-semibold">Delivery</TableHead>
              <TableHead className="font-semibold">Marketeer</TableHead>
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="font-medium">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={order.receiption_status === 'Received' ? 'default' : 'secondary'}>
                    {order.receiption_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select onValueChange={(value) => updateOrderStatus(order.id, value)} defaultValue={order.status}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
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
                <TableCell className="truncate max-w-[150px]">
                  {(order.user as { email?: string })?.email || 'N/A'}
                </TableCell>
                <TableCell className="font-mono">{order.slug}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {order.order_items.length} item(s)
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-50 hover:text-blue-600"
                        onClick={() =>
                          setSelectedProducts(order.order_items.map(item => ({
                            order_id: order.id,
                            product: item.product,
                            quantity: item.quantity,
                          })))
                        }
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Products</h4>
                          <div className="border rounded-lg divide-y">
                            {selectedProducts.map(({ product, quantity }, index) => (
                              <div key={index} className="p-3 flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{product.title}</p>
                                  <p className="text-sm text-gray-500">EN: {product.sku || 'N/A'}</p>
                                </div>
                                <Badge variant="outline">{quantity} boxes</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
