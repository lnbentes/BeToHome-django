import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventsService } from '../services/eventsService';

export function Calendar() {
  const [events, setEvents] = useState<any[]>([]);
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    loadEvents();
  }, [currentMonth, currentYear]);

  const loadEvents = async () => {
    try {
      const res = await eventsService.list();
      const extractArray = (res: any) => Array.isArray(res) ? res : (res?.results || res?.data || []);
      setEvents(extractArray(res));
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  
  // Calculate days for the calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const cells = [];
  
  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} className="bg-white dark:bg-earth-900 min-h-[72px] md:min-h-[120px] p-1.5 md:p-2"></div>);
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    const dayEvents = events.filter((e: any) => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === d && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    cells.push(
      <div key={`day-${d}`} className="bg-white dark:bg-earth-900 min-h-[72px] md:min-h-[120px] p-1.5 md:p-2 hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors">
        {isToday ? (
          <span className="text-sm font-medium bg-forest-600 text-white w-7 h-7 flex items-center justify-center rounded-full">{d}</span>
        ) : (
          <span className="text-sm font-medium text-earth-400">{d}</span>
        )}
        <div className="mt-1 space-y-0.5 md:space-y-1">
          {dayEvents.map((e: any) => (
            <div 
              key={e.id} 
              className={`text-[10px] p-1 rounded truncate border-l-2`}
              style={{
                backgroundColor: `${e.color}20`,
                color: e.color,
                borderLeftColor: e.color
              }}
            >
              {e.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fill remaining cells for grid 7x6 usually
  const remainingCells = 42 - cells.length;
  for (let i = 0; i < remainingCells; i++) {
    cells.push(<div key={`empty-end-${i}`} className="bg-white dark:bg-earth-900 min-h-[72px] md:min-h-[120px] p-1.5 md:p-2"></div>);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  return (
    <div className="animate-in bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 p-4 md:p-8">
      <div className="flex justify-between items-center mb-5 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <CalendarIcon size={28} className="text-forest-600 shrink-0" />
          {MONTHS_FULL[currentMonth]} {currentYear}
        </h2>
        <div className="flex gap-2">
          <button onClick={handlePrevMonth} className="p-2 rounded-xl border border-earth-200 dark:border-earth-800 hover:bg-earth-50 dark:hover:bg-earth-800">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextMonth} className="p-2 rounded-xl border border-earth-200 dark:border-earth-800 hover:bg-earth-50 dark:hover:bg-earth-800">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-scroll-wrapper -mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto">
        <div className="calendar-grid grid grid-cols-7 gap-px bg-earth-200 dark:bg-earth-800 rounded-xl overflow-hidden shadow-inner min-w-[600px]">
          {weekDays.map(d => (
            <div key={d} className="bg-earth-50 dark:bg-earth-950 p-2 md:p-4 text-center text-xs font-bold text-earth-500 uppercase">
              {d}
            </div>
          ))}
          {cells}
        </div>
      </div>
    </div>
  );
}
