// core/router.js - Roteamento e navegação entre views
// Depende de: core/state.js (state), ui.js (ui) e as views registradas

const router = {
    navigateTo(view) {
        state.currentView = view;

        // Atualiza item ativo na barra de navegação
        document.querySelectorAll('.nav-item').forEach(btn => {
            if (btn.dataset.view === view) {
                btn.classList.add('bg-forest-50', 'text-forest-700', 'dark:bg-forest-900/20', 'dark:text-forest-300');
                btn.classList.remove('text-earth-600', 'dark:text-earth-400');
            } else {
                btn.classList.remove('bg-forest-50', 'text-forest-700', 'dark:bg-forest-900/20', 'dark:text-forest-300');
                btn.classList.add('text-earth-600', 'dark:text-earth-400');
            }
        });

        switch (view) {
            case 'dashboard': ui.renderDashboard(state);         break;
            case 'tasks':     ui.renderTasks(state.tasks);       break;
            case 'finance':   ui.renderFinance(state);           break;
            case 'places':    ui.renderPlaces(state.places);     break;
            case 'calendar':  ui.renderCalendar(state.events);   break;
            case 'admin':     window.location.href = '/admin/';  break;
        }
    },
};
