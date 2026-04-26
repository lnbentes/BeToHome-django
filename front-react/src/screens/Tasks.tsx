import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Square, MoreVertical } from 'lucide-react';
import { tasksService } from '../services/tasksService';

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Concluída',
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em andamento'
};

export function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await tasksService.list();
      const extractArray = (res: any) => Array.isArray(res) ? res : (res?.results || res?.data || []);
      setTasks(extractArray(res));
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (task: any) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await tasksService.update(task.id, { ...task, status: newStatus });
      loadTasks();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Suas Tarefas</h2>
        <button className="bg-forest-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-forest-700 transition-all">
          <Plus size={20} /> Nova Tarefa
        </button>
      </div>

      <div className="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-earth-500">Carregando...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-earth-500">Nenhuma tarefa encontrada.</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 md:p-4 border-b border-earth-100 dark:border-earth-800 hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors">
              <button 
                onClick={() => handleToggleStatus(task)}
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                  task.status === 'COMPLETED' 
                    ? 'bg-forest-100 text-forest-600' 
                    : 'bg-earth-100 text-earth-500 hover:bg-forest-50 hover:text-forest-500'
                }`}
              >
                {task.status === 'COMPLETED' ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-earth-800 dark:text-earth-200 truncate ${task.status === 'COMPLETED' ? 'line-through opacity-50' : ''}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-earth-500">{task.due_date || ''}</p>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`hidden sm:inline px-2.5 py-1 text-xs rounded-full font-medium ${
                  task.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {STATUS_LABELS[task.status] || task.status}
                </span>
                <button className="p-2 rounded-lg text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-earth-700 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
