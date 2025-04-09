'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FiTrendingUp, FiPieChart, FiLayers, FiUsers, FiHome } from 'react-icons/fi';

type MonthlyOrderData = {
  name: string;
  orders: number;
};

type CatrgoryData = {
  name: string;
  products: number;
};

type LatestUser = {
  id: string;
  email: string;
  date: string | null;
};

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899'];

const PageComponent = ({
  monthlyOrders,
  categoryData,
  latestUsers,
}: {
  monthlyOrders: MonthlyOrderData[];
  categoryData: CatrgoryData[];
  latestUsers: LatestUser[];
}) => {
  // Calculate total orders from monthlyOrders data
  const totalOrders = monthlyOrders.reduce((sum, month) => sum + month.orders, 0);

  return (
    <div className='flex-1 p-8 overflow-auto bg-gray-50 dark:bg-gray-900'>
      <div className='flex items-center mb-6 space-x-3'>
        <FiHome className='text-2xl text-indigo-500' />
        <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600'>
          Dashboard Overview
        </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Stats Overview */}
        <div className='md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30'>
                <FiTrendingUp className='text-indigo-500 text-xl' />
              </div>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Total Orders</p>
                <p className='text-xl font-semibold'>{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 rounded-lg bg-green-50 dark:bg-green-900/30'>
                <FiPieChart className='text-green-500 text-xl' />
              </div>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Categories</p>
                <p className='text-xl font-semibold'>{categoryData.length}</p>
              </div>
            </div>
          </div>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30'>
                <FiLayers className='text-amber-500 text-xl' />
              </div>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Total Products</p>
                <p className='text-xl font-semibold'>
                  {categoryData.reduce((sum, cat) => sum + cat.products, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 rounded-lg bg-pink-50 dark:bg-pink-900/30'>
                <FiUsers className='text-pink-500 text-xl' />
              </div>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>New Marketers</p>
                <p className='text-xl font-semibold'>{latestUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <Card className='border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardHeader className='pb-3'>
            <div className='flex items-center space-x-2'>
              <FiTrendingUp className='text-indigo-500' />
              <CardTitle className='text-lg font-semibold'>Orders Over Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[280px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={monthlyOrders}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E5E7EB' />
                  <XAxis 
                    dataKey='name' 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Bar 
                    dataKey='orders' 
                    fill='#6366F1' 
                    radius={[4, 4, 0, 0]}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Products Chart */}
        <Card className='border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardHeader className='pb-3'>
            <div className='flex items-center space-x-2'>
              <FiPieChart className='text-green-500' />
              <CardTitle className='text-lg font-semibold'>Product Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[280px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey='products'
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    animationDuration={1000}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke='#FFFFFF'
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category to Products Chart */}
        <Card className='border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardHeader className='pb-3'>
            <div className='flex items-center space-x-2'>
              <FiLayers className='text-amber-500' />
              <CardTitle className='text-lg font-semibold'>Products per Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[280px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E5E7EB' />
                  <XAxis 
                    dataKey='name' 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Bar 
                    dataKey='products' 
                    fill='#10B981' 
                    radius={[4, 4, 0, 0]}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Latest Users 
        <Card className='md:col-span-2 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
          <CardHeader className='pb-3'>
            <div className='flex items-center space-x-2'>
              <FiUsers className='text-pink-500' />
              <CardTitle className='text-lg font-semibold'>Latest Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='text-gray-500 dark:text-gray-400'>Email</TableHead>
                  <TableHead className='text-gray-500 dark:text-gray-400'>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestUsers.map(user => (
                  <TableRow key={user.id} className='border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <TableCell className='font-medium'>{user.email}</TableCell>
                    <TableCell className='text-gray-500 dark:text-gray-400'>{user.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>*/}
      </div>
    </div>
  );
};

export default PageComponent;
