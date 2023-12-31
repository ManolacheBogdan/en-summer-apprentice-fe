export async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:8080/orders');
        if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orderData = await response.json();
      return orderData;
    } catch (error) {
      console.error('Error fetching event data:', error);
      return []; 
    }
  }