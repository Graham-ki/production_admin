'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const supabaseUrl = 'https://kxnrfzcurobahklqefjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bnJmemN1cm9iYWhrbHFlZmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5NTk1MzUsImV4cCI6MjA1MzUzNTUzNX0.pHrrAPHV1ln1OHugnB93DTUY5TL9K8dYREhz1o0GkjE'; // Ensure you replace this securely
const supabase = createClient(supabaseUrl, supabaseKey);

type Material = {
  id: number;
  name: string;
  amount_available: number;
};

type MaterialEntry = {
  id: number;
  material_name: string;
  quantity: number;
  action: string;
  date: string;
  created_by: string;
};

export default function MaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  // Fetch materials
  useEffect(() => {
    const fetchMaterials = async () => {
      const { data, error } = await supabase.from('materials').select('id, name, amount_available');
      if (error) console.error('Error fetching materials:', error);
      else setMaterials(data || []);
    };

    fetchMaterials();
  }, []);

  // Fetch material entries
  useEffect(() => {
    const fetchEntries = async () => {
      let query = supabase
        .from('material_entries')
        .select('id, material_id, quantity, action, date, created_by')
        .eq('created_by', 'Production Manager');

      if (filter === 'daily' || filter === 'monthly' || filter === 'yearly') {
        query = query.order('date', { ascending: false });
      }
      if (filter === 'daily') {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('date', today);
      } else if (filter === 'monthly') {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        query = query.gte('date', firstDayOfMonth.toISOString());
      } else if (filter === 'yearly') {
        const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
        query = query.gte('date', firstDayOfYear.toISOString());
      } else if (filter === 'custom' && customDate) {
        query = query.eq('date', customDate);
      }

      const { data: entries, error: entriesError } = await query;
      if (entriesError) {
        console.error('Error fetching material entries:', entriesError);
        return;
      }

      const materialIds = [...new Set(entries.map(entry => entry.material_id))];

      const { data: materials, error: materialsError } = await supabase
        .from('materials')
        .select('id, name')
        .in('id', materialIds);

      if (materialsError) {
        console.error('Error fetching materials:', materialsError);
        return;
      }

      const mergedEntries = entries.map(entry => ({
        ...entry,
        material_name: materials.find(material => material.id === entry.material_id)?.name || 'Unknown',
      }));

      setMaterialEntries(mergedEntries);
    };

    fetchEntries();
  }, [filter, customDate]);

  // Handle adding material entry
  const handleAddEntry = async () => {
    if (!selectedMaterial || !quantity || !action) {
      alert('Please select a material, specify quantity, and choose an action.');
      return;
    }

    setLoading(true);
    const currentDate = new Date().toISOString();

    const { error: entryError } = await supabase.from('material_entries').insert([
      {
        material_id: selectedMaterial,
        quantity: Number(quantity),
        action,
        date: currentDate,
        created_by: 'Production Manager',
      },
    ]);

    if (entryError) {
      console.error('Error adding material entry:', entryError);
      alert('Failed to add material entry.');
      setLoading(false);
      return;
    }else{
      alert('Material entry added successfully.');
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold shadow-lg p-4 rounded-lg bg-blue-100 dark:bg-gray-800 dark:text-white">
          Materials Management
        </h1>

        {/* Add Entry Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Add Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Material Entry</DialogTitle>
              <DialogDescription>Select material and specify quantity.</DialogDescription>
            </DialogHeader>

            {/* Material Selection */}
            <Select onValueChange={(value) => setSelectedMaterial(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={String(material.id)}>
                    {material.name} (Available: {material.amount_available})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Quantity Input */}
            <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full" />

            {/* Action Selection */}
            <Select onValueChange={setAction}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Used">Used</SelectItem>
              </SelectContent>
            </Select>

            {/* Submit Button */}
            <Button onClick={handleAddEntry} disabled={loading}>
              {loading ? 'Processing...' : 'Add Entry'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Controls */}
      <div className="mb-4 flex gap-2">
        <Select onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="custom">Custom Date</SelectItem>
          </SelectContent>
        </Select>

        {filter === 'custom' && (
          <Input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="w-[180px]"
          />
        )}
      </div>

      {/* Entries Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materialEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.material_name}</TableCell>
              <TableCell>{entry.quantity}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}