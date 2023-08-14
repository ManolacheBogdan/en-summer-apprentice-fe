import { formatDate } from '../utils';
import { renderOrdersPage } from '../../main';
import { deleteOrder } from './Api/deleteOrder';
import { fetchOrders } from './Api/fetchOrder';

export function renderOrder(order, event){
    const orderCard = document.createElement('div');
    const contentMarkupOrders = `
    <div class='orders-content'>
      <div class="order-details">
        <div class="order-field">
          <span class="field-name">Order ID:</span>
          <span class="field-value">${order.orderID}</span>
        </div>
        <div class="order-field">
          <span class="field-name">Event Name:</span>
          <span class="field-value">${event ? event.eventName : 'Unknown Event'}</span>
        </div>
        <div class="order-field">
          <span class="field-name">Number of Tickets:</span>
          <span class="field-value">${order.numberOfTickets}</span>
        </div>
        <div class="order-field">
          <span class="field-name">Ordered At:</span>
          <span class="field-value">${formatDate(order.orderedAt)}</span>
        </div>
        <div class="order-field">
          <span class="field-name">Total Price:</span>
          <span class="field-value">${order.totalPrice}</span>
        </div>
        <div class="order-buttons">
          <button class="edit-button">Edit</button>
        </div>
      </div>
    </div>
  `;
    orderCard.innerHTML = contentMarkupOrders;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', async () => {
      deleteOrder(order.orderID);
    });
  
    const orderDetails = orderCard.querySelector('.order-details');
    const orderButtons = orderDetails.querySelector('.order-buttons');
    orderButtons.appendChild(deleteButton);

    return orderCard; 
  }