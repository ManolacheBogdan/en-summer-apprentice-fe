export async function fetchTicketCategories() {
    try {
        const response = await fetch('http://localhost:8080/ticketCategories/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const ticketCategoryData = await response.json();
        return ticketCategoryData;
    } catch (error) {
        console.error('Error fetching ticket category data:', error);
        return [];
    }
}