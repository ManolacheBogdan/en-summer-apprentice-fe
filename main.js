import {renderHomePage, renderOrdersPage} from './src/components/renders';
import {fetchEventData} from './src/components/fetchEventData';
import {useStyle} from './src/components/styles';
import {fetchOrders} from './src/components/fetchOrder';
import {removeLoader, addLoader} from './src/components/loader';
import { applyFilter, clearFilters } from './src/components/renders';
//import {getTicketCategories} from './components/api/getTicketCategories';

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
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
    <div class="orders flex items-center justify-center flex-wrap">
    </div>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

async function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    const eventData = await fetchEventData();
    renderHomePage(eventData);
  } else if (url === '/orders') {
    const orderData = await fetchOrders();
    const eventData = await fetchEventData();
    console.log("orderData", orderData);
    renderOrdersPage(orderData, eventData);
  }
}


export const postOrder = (id, ticketID, input) => {
  const numberOfTickets = input.value;
  console.log(id, ticketID, input.value);
  if (parseInt(numberOfTickets)) {
  addLoader();
  fetch('http://localhost:8080/orders', {
    method: "POST",
    headers: {
      "Content-Type": 'application/json',
    },
    body: JSON.stringify({
      eventID: id, 
      ticketCategoryID: ticketID,
      noOfTickets: +numberOfTickets,
      customerId: 5
    }),
  }).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  })
  .then((data) => {
    input.value = 0;
    console.log('order succes');
    toastr.success('Order succesfully created!');
  })
  .catch((error) => {
    console.error('error saving purchased event:', error);
     toastr.error('Error!');
  })
  .finally(() => {
    setTimeout(() => {
      removeLoader();
    }, 800);
  });
  } else {
      toastr.error('Please enter a valid number of tickets!');
  }
}

export const createEvent = (eventData) => {
    const eventElement = renderEventCard(eventData);
    return eventElement;
};

function setupFilterEvent() {
  const applyFilterButton = document.getElementById('applyFilter');
  console.log("ApplyFilter", applyFilterButton);
  applyFilterButton.addEventListener('click', applyFilter);
}

function setupClearFilter() {
  const clearFiltersButton = document.getElementById('clearFilters');
  clearFiltersButton.addEventListener('click', clearFilters);
}


// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
setupFilterEvent();
setupClearFilter();
