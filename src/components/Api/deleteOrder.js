import { addLoader, removeLoader } from "../loader";

export async function deleteOrder(orderID) {
    addLoader();
    fetch(`http://192.168.1.105:7007/api/OrderDelete?id=${orderID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Error deleting order');
        }
        if (res.status === 204) {
            return null; 
        }
        return res.json();
    })
    .then((data) => {
        removeLoader();
        toastr.success('Order deleted!');
        const orderElement = document.querySelector(`[data-order-id="${orderID}"]`);
        if (orderElement) {
            orderElement.remove();
        }
    })
    .catch((error) => {
        removeLoader();
        console.log(error);
        toastr.error(error);
    });
}



 