
import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useLottoTypes } from '@/hooks/useLottoTypes';
import { LottoTypesList } from '@/components/admin/lotto-types/LottoTypesList';
import { AddLottoTypeDialog } from '@/components/admin/lotto-types/AddLottoTypeDialog';

export default function LottoTypes() {
  const { lottoTypes, loading, addLottoType, updateLottoType, deleteLottoType } = useLottoTypes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lottery Types</h1>
          <AddLottoTypeDialog
            onAddType={addLottoType}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>

        <LottoTypesList 
          lottoTypes={lottoTypes} 
          loading={loading} 
          onUpdateType={updateLottoType}
          onDeleteType={deleteLottoType}
        />
      </div>
    </AdminLayout>
  );
}
