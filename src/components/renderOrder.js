import { formatDate } from '../utils';
import { renderOrdersPage } from '../../main';
import { deleteOrder } from './Api/deleteOrder';
import { fetchOrders } from './Api/fetchOrder';
import { updateOrder } from './Api/updateOrder';
//import {fetchTicketCategories} from './Api/fetchTicketCategories';
import {fetchTicketCategories} from '../components/Api/fetchOrder';

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
        <label for="editCategory">Ticket Category:</label>
          <select id="editCategory" disabled>
             <option value="Standard" ${order.ticketCategory === 'Standard' ? 'selected' : ''}>Standard</option>
             <option value="VIP" ${order.ticketCategory === 'VIP' ? 'selected' : ''}>VIP</option>
          </select>
        </div>
        <div class="order-field">
        <label for="editTickets">Number of Tickets:</label>
        <input type="number" id="editTickets" value="${order.numberOfTickets}" disabled style="width: 60px;">
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
          <button class="save-button" style="display: none;">Save</button>
          <button class="cancel-button" style="display: none;">Cancel</button>
        </div>
      </div>
    </div>
  `;
    orderCard.innerHTML = contentMarkupOrders;

    const editButton = orderCard.querySelector('.edit-button');
    const saveButton = orderCard.querySelector('.save-button');
    const cancelButton = orderCard.querySelector('.cancel-button');
    const orderDetails = orderCard.querySelector('.order-details');
    const editCategoryInput = orderCard.querySelector('#editCategory');
    const editTicketsInput = orderCard.querySelector('#editTickets');
  
    editButton.addEventListener('click', () => {
      editCategoryInput.removeAttribute('disabled');
      editTicketsInput.removeAttribute('disabled');
      editButton.style.display = 'none';
      deleteButton.style.display = 'none';
      saveButton.style.display = 'inline';
      cancelButton.style.display = 'inline';
    });

    cancelButton.addEventListener('click', () => {
      editCategoryInput.setAttribute('disabled', 'disabled');
      editTicketsInput.setAttribute('disabled', 'disabled');
      editButton.style.display = 'inline';
      deleteButton.style.display = 'inline';
      saveButton.style.display = 'none';
      cancelButton.style.display = 'none';
    });

    saveButton.addEventListener('click', async () => {
      const editCategory = editCategoryInput.value;
      const editTickets = parseInt(editTicketsInput.value);
      const updatedData = {
        OrderId: order.orderID,
        NumberOfTickets: editTickets,
        TicketCategory: editCategory,
      };
      try {
        await updateOrder(order.orderID, updatedData);

        const updatedTicketCategories = await fetchTicketCategories()
        
        order.ticketCategory = editCategory;
        order.numberOfTickets = editTickets;
        
        renderOrdersPage(orderData, eventData, );
      } catch (error) {
        console.error(error);
        toastr.error('Error updating order');
      }
    });


    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', async () => {
      deleteOrder(order.orderID);
    });

    const orderButtons = orderDetails.querySelector('.order-buttons');
    orderButtons.appendChild(deleteButton);

    return orderCard; 
  }