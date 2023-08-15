import {fetchEventData} from './src/components/Api/fetchEventData';
import {fetchOrders} from './src/components/Api/fetchOrder';
import {removeLoader, addLoader} from './src/components/loader';
import { renderEventCard } from './src/components/renderEvent';
import { renderOrder } from './src/components/renderOrder';
import { fetchEventTypeData, fetchLocationData, fetchFilteredEventData } from './src/components/Api/fetchEventTypeAndLocation';

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/events2.png" alt="summer" width="3200px">
      <div class="filter">
        <input type="text" id="eventNameFilter" placeholder="Filter by Name">
        <select id="locationFilter">
          <option value="">All Locations</option>
        </select>
        <select id="eventTypeFilter">
          <option value="">All Event Types</option>
        </select>

      </div>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
</div>
    <div class="orders flex items-center justify-center flex-wrap">
    </div>
    </div>
  `;
}

export async function renderHomePage(eventData) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  addLoader();
  
  const eventsContainer = document.querySelector('.events');
  
  const eventNameFilter = document.getElementById('eventNameFilter');
  const locationFilter = document.getElementById('locationFilter');
  const eventTypeFilter = document.getElementById('eventTypeFilter');
  const filteredEventData = eventData.slice(); 

  const locationData = await fetchLocationData(); 
  populateFilterOptions(locationFilter, locationData);

  const eventTypeData = await fetchEventTypeData(); 
  populateFilterOptions(eventTypeFilter, eventTypeData);
  
  eventNameFilter.addEventListener('input', () => {
    const eventNameFilterValue = eventNameFilter.value.toLowerCase();
    const filteredEvents = filterEventsByName(filteredEventData, eventNameFilterValue);
    renderEvents(eventsContainer, filteredEvents);
  });

  locationFilter.addEventListener('change', () => filterEvents(eventsContainer)); 
  eventTypeFilter.addEventListener('change', () => filterEvents(eventsContainer));
  console.log("container", eventsContainer);
  renderEvents(eventsContainer, filteredEventData);
}

  
  function filterEventsByName(events, nameFilter) {
  return events.filter(event => event.name.toLowerCase().includes(nameFilter));
  }

  
function renderEvents(container, events) { 
    container.innerHTML = '';
    if (events.length === 0) {
      container.innerHTML = '<p>No events found.</p>';
      removeLoader();
      return;
    }
  
  events.forEach(event => {
    const eventCard = renderEventCard(event);
    container.appendChild(eventCard);
  });
  setTimeout(() => {
    removeLoader();
  }, 800);
      
  }

  async function filterEvents(eventsContainer) {
    const selectedLocation = locationFilter.value;
    const selectedEventType = eventTypeFilter.value;

    if (!selectedLocation && !selectedEventType) {
      renderEvents(eventsContainer, filteredEventData);
      return;
    }
    const filteredEventData = await fetchFilteredEventData(selectedEventType, selectedLocation);
    renderEvents(eventsContainer, filteredEventData);


  }

  function populateFilterOptions(selectElement, options) {
    if (Array.isArray(options)) {
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
      });
    }
  }
    
  
  

  export function renderOrdersPage(orderData, eventData) {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getOrdersPageTemplate();
    addLoader();
    const ordersContainer = document.querySelector('.orders');
    ordersContainer.innerHTML = '';
    orderData.forEach((order) => {
        const event = eventData.find((event) => event.eventID === order.eventID);
        const orderCard = renderOrder(order,event);
        ordersContainer.appendChild(orderCard);
      });
      setTimeout(() => {
        removeLoader();
      }, 800);
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
    renderOrdersPage(orderData, eventData);
  }
}



// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();

