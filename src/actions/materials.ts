import { createClient } from '@/supabase/server';
const supabase = createClient();

export default async function handler(req, res) {
    try {
      // Fetch materials from the 'materials' table
      const { data: materials, error } = await (await supabase)
        .from('materials')
        .select('*'); // You can adjust this query to select specific fields
  
      if (error) {
        throw error;
      }
  
      // Return the fetched data as JSON
      res.status(200).json(materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ error: 'Error fetching materials' });
    }
  }