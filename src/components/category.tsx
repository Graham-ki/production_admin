import { format } from 'date-fns';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { TableCell, TableRow } from '@/components/ui/table';
import { CreateCategorySchema } from '@/app/admin/stock/categories/create-category.schema';
import { CategoryWithProducts } from '@/app/admin/stock/categories/categories.types';

export const CategoryTableRow = ({
  category,
  setCurrentCategory,
  setIsCreateCategoryModalOpen,
  deleteCategoryHandler,
}: {
  category: CategoryWithProducts;
  setCurrentCategory: (category: CreateCategorySchema | null) => void;
  setIsCreateCategoryModalOpen: (isOpen: boolean) => void;
  deleteCategoryHandler: (id: number) => Promise<void>;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditClick = (category: CreateCategorySchema) => {
    setCurrentCategory({
      name: category.name,
      intent: 'update',
      slug: category.slug,
    });
    setIsCreateCategoryModalOpen(true);
  };

  const handleDelete = async () => {
    await deleteCategoryHandler(category.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <TableRow>
        <TableCell className='font-medium'>{category.name}</TableCell>
        <TableCell className='md:table-cell'>
          {format(new Date(category.created_at), 'yyyy-MM-dd')}
        </TableCell>
        <TableCell className='md:table-cell'>
          {category.products && category.products.length > 0 ? (
            <Dialog>
              <DialogTrigger>
                {category.products
                  .slice(0, 2)
                  .map(product => product.title)
                  .join(', ')}
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className='sr-only'>
                  Category product list
                </DialogTitle>
                <h2>Products</h2>
                <ScrollArea className='h-[400px] rounded-md p-4'>
                {category.products.map(product => (
                  <Card key={product.id} className='cursor-pointer mb-4'> {/* Added margin-bottom */}
                    <div className='grid grid-cols-[100px,1fr] items-center gap-4'>
                      <div className='flex items-center space-x-2'>
                        <h3 className='font-medium leading-none'>
                          {product.title} 
                        </h3>
                        <p className='text-sm text-muted-foreground flex-shrink-0 truncate'>
                          : {product.maxQuantity} boxes available
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </ScrollArea>

              </DialogContent>
            </Dialog>
          ) : (
            'No products linked to this category'
          )}
        </TableCell>
      </TableRow>
    </>
  );
};
