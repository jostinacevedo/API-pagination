// Esta API no necesita KEY, así que no fallará el "Fetch"
const BASE_URL = 'https://digimon-api.vercel.app/api/digimon';

async function fetchGames(page, pageSize) {
    // Nota: Esta API en particular devuelve todo el array, 
    // así que simularemos la paginación en el cliente para que tu lógica funcione
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error("Error al conectar con la API");
        
        const allData = await response.json();
        
        // Lógica de paginación manual para cumplir con tus requisitos
        const start = (page - 1) * pageSize;
        const end = start + parseInt(pageSize);
        const paginatedItems = allData.slice(start, end);

        return {
            results: paginatedItems,
            count: allData.length,
            info: {
                pages: Math.ceil(allData.length / pageSize)
            }
        };
    } catch (error) {
        throw error;
    }
}