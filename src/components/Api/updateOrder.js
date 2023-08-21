import { addLoader, removeLoader } from "../loader";

export async function updateOrder(updatedData) {
    addLoader();
    try {
      const response = await fetch(`http://172.16.99.89:7007/api/OrderPatch`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error('Error updating order');
      }
      
      toastr.success('Order updated!');
    } catch (error) {
      console.log(error);
      toastr.error(error);
    } finally {
      removeLoader();
    }
  }
  