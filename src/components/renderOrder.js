import { formatDate } from '../utils';
import { renderOrdersPage } from '../../main';
import { deleteOrder } from './Api/deleteOrder';
import { fetchOrders } from './Api/fetchOrder';
import { updateOrder } from './Api/updateOrder';
import {fetchTicketCategories} from './Api/fetchTicketCategories';



export function renderOrder(order, event){
    const orderCard = document.createElement('div');
     orderCard.id = `order-${order.orderID}`;
     const categories = event.ticketCategories;
     const categoriesOptions = categories
       .map(
         (ticket_Category) =>
           `<option value="${ticket_Category.ticketCategoryID}" ${ticket_Category.ticketCategoryID === order.ticketCategoryID ? 'selected' : ''}>${ticket_Category.ticketDescription}</option>`).join('\n');;
    const contentMarkupOrders = `
    <div class='orders-content'>
      <div class="order-details">
        <div class="order-field">
          <span class="field-name">Order ID:</span>
          <span class="field-value">${order.orderID}</span>
        </div>
        <div class="order-field">
          <span class="field-name">Event Name:</span>
          <span class="field-value">${event ? event.name : 'Unknown Event'}</span>
        </div>
        <div class="order-field">
        <label for="editCategory">Ticket Category:</label>
        <select id="editCategory" disabled>
        ${categoriesOptions}
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
  
    editCategoryInput.innerHTML = categoriesOptions;
    editCategoryInput.disabled = true;
    
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
        TicketCategoryId: parseInt(editCategory),
      };

      

      try {
        await updateOrder(updatedData);
        order.ticketCategory = editCategory;
        order.numberOfTickets = editTickets;
        updateOrderCard(orderCard, order, event);
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
      removeOrderCard(order.orderID);
    });

    const orderButtons = orderDetails.querySelector('.order-buttons');
    orderButtons.appendChild(deleteButton);

    return orderCard; 
  }

  function removeOrderCard(orderID) {
  const orderCard = document.getElementById(`order-${orderID}`);
  if (orderCard) {
    orderCard.remove();
  }
}


function updateOrderCard(orderCard, order, event) {
  const fieldValues = orderCard.querySelectorAll('.field-value');
  fieldValues[0].textContent = event ? event.name : 'Unknown Event';
  fieldValues[1].textContent = order.ticketCategory;
  fieldValues[2].textContent = order.numberOfTickets;
  fieldValues[3].textContent = order.totalPrice;
}
