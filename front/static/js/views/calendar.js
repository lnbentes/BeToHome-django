// views/calendar.js - Renderização da tela de Calendário

ui.renderCalendar = function (events) {
    const container = document.getElementById('view-container');
    document.getElementById('view-title').innerText = 'Calendário';

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const dayHeaders = weekDays.map(d =>
        `<div class="bg-earth-50 dark:bg-earth-950 p-2 md:p-4 text-center text-xs font-bold text-earth-500 uppercase">${d}</div>`
    ).join('');

    const today = new Date().getDate();
    const dayCells = Array(31).fill(0).map((_, i) => {
        const day = i + 1;
        const dayEvents = events.filter(e => new Date(e.date).getDate() === day);
        const eventBadges = dayEvents.map(e =>
            `<div class="text-[10px] p-1 rounded bg-${e.color}-100 text-${e.color}-700 truncate border-l-2 border-${e.color}-500">${e.title}</div>`
        ).join('');

        const dayLabel = day === today
            ? `<span class="text-sm font-medium bg-forest-600 text-white w-7 h-7 flex items-center justify-center rounded-full">${day}</span>`
            : `<span class="text-sm font-medium text-earth-400">${day}</span>`;

        return `
            <div class="bg-white dark:bg-earth-900 min-h-[72px] md:min-h-[120px] p-1.5 md:p-2 hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors">
                ${dayLabel}
                <div class="mt-1 space-y-0.5 md:space-y-1">${eventBadges}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="animate-in bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 p-4 md:p-8">
            <div class="flex justify-between items-center mb-5 md:mb-8">
                <h2 class="text-xl md:text-2xl font-bold flex items-center gap-3">
                    <ion-icon name="calendar-outline" class="text-forest-600 shrink-0"></ion-icon>
                    Junho 2024
                </h2>
                <div class="flex gap-2">
                    <button class="p-2 rounded-xl border border-earth-200 dark:border-earth-800"><ion-icon name="chevron-back"></ion-icon></button>
                    <button class="p-2 rounded-xl border border-earth-200 dark:border-earth-800"><ion-icon name="chevron-forward"></ion-icon></button>
                </div>
            </div>

            <!-- Scroll horizontal em telas menores que 560px -->
            <div class="calendar-scroll-wrapper -mx-4 md:mx-0 px-4 md:px-0">
                <div class="calendar-grid grid grid-cols-7 gap-px bg-earth-200 dark:bg-earth-800 rounded-xl overflow-hidden shadow-inner">
                    ${dayHeaders}
                    ${dayCells}
                </div>
            </div>
        </div>
    `;
};
