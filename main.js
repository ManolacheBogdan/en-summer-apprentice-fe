import {renderHomePage, renderOrdersPage} from './src/components/renders';
import {fetchEventData} from './src/components/fetchEventData';
import {useStyle} from './src/components/styles';
import {fetchOrders} from './src/components/fetchOrder';
//npm import {removeLoader, addLoader} from './components/loader';
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

async function fetchTicketEvents() {
  const response = await fetch('http://localhost:8080/events/all');
  const data = await response.json();
  return data;
}


function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('increment')) {
      const input = target.parentElement.querySelector('.quantity-input');
      input.value = parseInt(input.value) + 1;
    } else if (target.classList.contains('decrement')) {
      const input = target.parentElement.querySelector('.quantity-input');
      const currentValue = parseInt(input.value);
      if (currentValue > 0) {
        input.value = currentValue - 1;
      }
    }
  });
});



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
    console.log(eventData);
    renderHomePage(eventData);
  } else if (url === '/orders') {
    renderOrdersPage();
  }
}


export const postOrder = (id, ticketID, input) => {
  const numberOfTickets = input.value;
  console.log(id, ticketID, input.value);
  if (parseInt(numberOfTickets)) {
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
    // eslint-disable-next-line no-undef
   // toastr.success('Order succesfully created!');
  })
  .catch((error) => {
    console.error('error saving purchased event:', error);
    // eslint-disable-next-line no-undef
    // toastr.error('Error!');
  })
  .finally(() => {
    //removeLoader();
  });
  } else {
    // eslint-disable-next-line no-undef
    //toastr.error('Please enter a valid number of tickets!');
  }
}

export const createEvent = (eventData) => {
    const eventElement = renderEventCard(eventData);
    return eventElement;
};

/*
document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('add-to-cart-btn')) {
    const eventCard = target.closest('.event-card');
    const eventID = eventCard.getAttribute('data-event-id');
    const ticketCategorySelect = eventCard.querySelector('#ticketCategories');
    const ticketCategoryId = ticketCategorySelect.value;
    const noOfTicketsInput = eventCard.querySelector('.quantity-input');
    const noOfTickets = parseInt(noOfTicketsInput.value);
    
    addToCartButton(eventID, ticketCategoryId, noOfTickets);
  }
});*/



// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
