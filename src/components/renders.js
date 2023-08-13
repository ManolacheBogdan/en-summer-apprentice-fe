import { useStyle } from "./styles";
import { postOrder } from "../../main";
import { removeLoader, addLoader } from "./loader";
import { fetchEventData } from "./fetchEventData";

function getHomePageTemplate() {
    return `
     <div id="content" >
        <img src="./src/assets/events2.png" alt="summer">
        <div class="events flex items-center justify-center flex-wrap">
        </div>
      </div>
    `;
  }
  
  function getOrdersPageTemplate() {
    return `
      <div id="content">
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class="filter">
      <div class="filter-inputs">
        <input type="text" id="nameFilter" placeholder="Filter by Name">
        <input type="number" id="priceFilter" placeholder="Filter by Price">
      </div>
      <div class="filter-buttons">
        <button id="applyFilter">Apply Filter</button>
        <button id="clearFilters">Clear Filters</button>
     </div>
  </div>
      <div class="orders flex items-center justify-center flex-wrap">
      </div>
      </div>
    `;
  }

  function renderEventCard(event){
    const eventCard = document.createElement('div');
    const inputClasses = useStyle('inputTicket');
    const addToCartBtnClasses = useStyle('addToCartBtn');
    eventCard.classList.add('event-card');
  
    const eventImageUrls = {
      1: "https://www.jcicraiova.ro/imagini/2019/02/MG_4991-800x600.jpg",
      2: "https://cdn.aktual24.ro/wp-content/uploads/2019/08/metallica.jpg",
      3: "https://media.cancan.ro/vq4rLdc0y5uLLfpqyL_m0gE6aEY=/1260x709/smart/filters:contrast(5):format(webp):quality(80)/https%3A%2F%2Fwww.cancan.ro%2Fwp-content%2Fuploads%2F2017%2F12%2F17432221%2F2-liga-campionilor-poza-simpla.jpg",
      4: "https://cdn.romania-insider.com/sites/default/files/styles/article_large_image/public/2022-09/row_of_glasses_-_wine_tasting_photo_134803399_c_ekaterina_molchanova_dreamstime.com_.jpg",
      5: "https://api.kissfm.ro/resized/articole/2022/08/05/untold2022-0805-044857-lr52869-alivecoverage-ctl_d7444d4c5dbae65cb5aae84735a49dac.jpg?w=800&h=600&c=1"
    };
    const { name, description, startDate, endDate, ticketCategories } = event;
    console.log('eventId', event.eventID);
    console.log('event', event);
    const eventIndex = event.eventID; 
      const contentMarkup = `
      <header>
        <h2 class="event-title text-2xl font-bold">${event.name}</h2>
      </header>
      <div class="content">
        <img src="${eventImageUrls[eventIndex] || 'URL_IMAGINE_LIPSA'}" alt="${name}" class="event-image w-full height-200 rounded object-cover mb-4">
        <p class="description text-gray-700">${description}</p>
        <p class="date">${formatDate(startDate)} - ${formatDate(endDate)}</p>
        <label for="ticketCategories">Select ticket category:</label>
        <select name="ticketCategories" id="ticketCategories-${event.eventID}">
        <option value="${ticketCategories[0].ticketCategoryID}">${ticketCategories[0].ticketDescription} </option>
        <option value="${ticketCategories[1].ticketCategoryID}">${ticketCategories[1].ticketDescription} </option>
        </select>
      </div>
    `;
    eventCard.innerHTML = contentMarkup;

    const input = document.createElement('input');
    const addToCart = document.createElement('button');
    
    input.classList.add(...inputClasses);
    input.type = 'number';
    input.min = '0';
    input.max = '15';
    input.value = '0';

    addToCart.classList.add(...addToCartBtnClasses);
    addToCart.innerText = 'Add ticket to Cart';
    addToCart.addEventListener('click', () => {
      const selectTicketCategory = document.querySelector(`#ticketCategories-${event.eventID}`)
      const ticketId = selectTicketCategory.value;
      postOrder(event.eventID, ticketId, input);
    });

    eventCard.appendChild(input);
    eventCard.appendChild(addToCart);
    return eventCard;
}
  

export function renderHomePage(eventData) {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = ''+'<div class="loader"><i class="fa-solid fa-spinner fa-spin"></i></div>'
    mainContentDiv.innerHTML = getHomePageTemplate();
    addLoader();
    const eventsContainer = document.querySelector('.events');
    eventData.forEach((event) => {
        const eventCard = renderEventCard(event);
        eventsContainer.appendChild(eventCard);
      });
      setTimeout(() => {
        removeLoader();
      }, 800);
  }
    


export function renderOrdersPage(orderData, eventData) {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getOrdersPageTemplate();
    addLoader();
    const ordersContainer = document.querySelector('.orders');
    ordersContainer.innerHTML = '';
    orderData.forEach((order) => {
        const event = eventData.find((event) => event.eventID === order.eventID);
        const orderCard = renderOrderCard(order);
        ordersContainer.appendChild(orderCard);
      });
      setTimeout(() => {
        removeLoader();
      }, 800);
  }



  function renderOrderCard(order, event){
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
          <button class="delete-button">Delete</button>
        </div>
      </div>
    </div>
  `;
    orderCard.innerHTML = contentMarkupOrders;
    return orderCard; 
  }

export function applyFilter() {
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
    const priceFilter = parseFloat(document.getElementById('priceFilter').value);
  
    const filteredOrders = orderData.filter((order) => {
      const orderName = order.name.toLowerCase();
      const orderPrice =  parseFloat(order.totalPrice.toString());
      const nameMatch = nameFilter === '' || orderName.includes(nameFilter);
      const priceMatch = isNaN(priceFilter) || orderPrice <= priceFilter;
  
      return nameMatch && priceMatch;
    });
    renderOrdersPage(filteredOrders);
  }


export function clearFilters() {
  document.getElementById('nameFilter').value = '';
  document.getElementById('priceFilter').value = '';
  renderOrdersPage(orderData); 
}
 
 function formatDate(dateArray) {
  const [year, month, day] = dateArray;
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString('ro-RO', options);
  return formattedDate;

}