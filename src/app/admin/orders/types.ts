import { createClient } from '@/supabase/server';
import { QueryData } from '@supabase/supabase-js';

const supabase = await createClient();

const ordersWithProductsQuery = supabase
  .from('order')
  .select('*, order_items:order_item(*, product(*)), user(*)')
  .or('status.eq.Approved,status.eq.Pending') // Filter for status = 'Approved' or 'Pending'
  .order('created_at', { ascending: false });
export type OrdersWithProducts = QueryData<typeof ordersWithProductsQuery>;
