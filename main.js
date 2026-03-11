// --- ESTADO ---
let state = {
    currentPage: 1,
    pageSize: 10, // Cantidad por defecto
    totalResults: 0,
    maxPages: 1
};

// --- ELEMENTOS ---
const gamesGrid = document.getElementById('games-grid');
const loader = document.getElementById('loader');
const pageInfo = document.getElementById('page-info');
const limitSelect = document.getElementById('limit-selector');

// --- FUNCIONES ---
async function loadGames(targetPage) {
    // 1. Validar límites
    if (targetPage < 1 || (state.maxPages > 0 && targetPage > state.maxPages)) return;

    // 2. Preparar UI
    state.currentPage = targetPage;
    showLoading(true);

    try {
        // 3. Llamada a la API
        const data = await fetchGames(state.currentPage, state.pageSize);
        
        // 4. Actualizar Estado
        state.totalResults = data.count;
        state.maxPages = Math.ceil(data.count / state.pageSize);

        // 5. Renderizar
        renderGames(data.results);
        updatePaginationUI();
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

function renderGames(digimons) {
    const gamesGrid = document.getElementById('games-grid');
    
    gamesGrid.innerHTML = digimons.map(digi => `
        <div class="game-card">
            <div class="game-img" style="background-image: url('${digi.img}')"></div>
            <div class="game-info">
                <h3>${digi.name}</h3>
                <p>⭐ Nivel: ${digi.level}</p>
                <p>📋 Tipo: Criatura Digital</p>
            </div>
        </div>
    `).join('');
}

function updatePaginationUI() {
    pageInfo.innerText = `Página ${state.currentPage} de ${state.maxPages}`;
    
    // Deshabilitar botones si estamos en los extremos
    document.getElementById('btn-prev').disabled = state.currentPage === 1;
    document.getElementById('btn-first').disabled = state.currentPage === 1;
    document.getElementById('btn-next').disabled = state.currentPage >= state.maxPages;
    document.getElementById('btn-last').disabled = state.currentPage >= state.maxPages;
}

function showLoading(isLoading) {
    loader.style.display = isLoading ? 'block' : 'none';
    gamesGrid.style.opacity = isLoading ? '0.3' : '1';
}

function showError(msg) {
    gamesGrid.innerHTML = `<div class="error-msg">⚠️ Error: ${msg}</div>`;
}

// --- EVENTOS ---
limitSelect.addEventListener('change', (e) => {
    state.pageSize = parseInt(e.target.value);
    loadGames(1); // Al cambiar el límite, siempre volvemos a la página 1
});

document.getElementById('btn-first').onclick = () => loadGames(1);
document.getElementById('btn-prev').onclick = () => loadGames(state.currentPage - 1);
document.getElementById('btn-next').onclick = () => loadGames(state.currentPage + 1);
document.getElementById('btn-last').onclick = () => loadGames(state.maxPages);

// Saltos múltiples (Ejemplo de 5 en 5)
document.getElementById('btn-prev-5').onclick = () => loadGames(state.currentPage - 5);
document.getElementById('btn-next-5').onclick = () => loadGames(state.currentPage + 5);

// Carga Inicial
loadGames(1);