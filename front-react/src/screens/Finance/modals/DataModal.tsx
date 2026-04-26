import { useState } from 'react';
import { useFinance } from '../FinanceContext';
import { financeService } from '../../../services/finance';
import { Modal } from './Modal';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

export function DataModal() {
  const { isDataModalOpen, setDataModalOpen, loadData, month, year } = useFinance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExport = () => {
    // Generate export URL based on current month/year
    window.open(financeService.transactions.export({ month, year }), '_blank');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await financeService.transactions.import(formData);
      setSuccess('Dados importados com sucesso!');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao importar arquivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm('Tem certeza? ISSO APAGARÁ TODAS AS TRANSAÇÕES, CONTAS E CATEGORIAS! Essa ação é irreversível.')) {
      return;
    }
    
    const confirmText = prompt('Digite "APAGAR TUDO" para confirmar:');
    if (confirmText !== 'APAGAR TUDO') {
      alert('Ação cancelada.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await financeService.transactions.bulkDelete({});
      setSuccess('Todos os dados foram apagados com sucesso.');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isDataModalOpen} 
      onClose={() => setDataModalOpen(false)} 
      title="Gerenciamento de Dados"
    >
      <div className="space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm">{success}</div>}

        <div className="p-4 border border-earth-200 dark:border-earth-700 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-earth-800 dark:text-earth-200">Exportar (JSON)</h4>
            <p className="text-xs text-earth-500 mt-1">Baixar backup do mês selecionado.</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-200 rounded-xl font-medium hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors"
          >
            <Download size={18} /> Exportar
          </button>
        </div>

        <div className="p-4 border border-earth-200 dark:border-earth-700 rounded-2xl flex items-center justify-between">
          <div>
            <h4 className="font-bold text-earth-800 dark:text-earth-200">Importar (JSON)</h4>
            <p className="text-xs text-earth-500 mt-1">Restaurar a partir de um backup.</p>
          </div>
          <label className="flex items-center gap-2 px-4 py-2 bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-200 rounded-xl font-medium hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors cursor-pointer">
            <Upload size={18} /> 
            {loading ? 'Importando...' : 'Importar'}
            <input type="file" accept=".json" className="hidden" onChange={handleImport} disabled={loading} />
          </label>
        </div>

        <div className="p-4 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold">
            <AlertTriangle size={18} /> ZONA DE PERIGO
          </div>
          <p className="text-xs text-earth-600 dark:text-earth-400 mb-4">
            Esta ação removerá **todas** as suas transações, contas e categorias permanentemente.
          </p>
          <button 
            onClick={handleBulkDelete}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} /> Apagar Tudo
          </button>
        </div>
      </div>
    </Modal>
  );
}
