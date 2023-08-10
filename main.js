import {renderHomePage, renderOrdersPage} from './components/renders';
import {fetchEventData} from './components/fetchEventData';


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
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('increment')) {
    const quantityLabel = target.parentElement.querySelector('.quantity-label');
    quantityLabel.textContent = parseInt(quantityLabel.textContent) + 1;
  } else if (target.classList.contains('decrement')) {
    const quantityLabel = target.parentElement.querySelector('.quantity-label');
    const currentQuantity = parseInt(quantityLabel.textContent);
    if (currentQuantity > 0) {
      quantityLabel.textContent = currentQuantity - 1;
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

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
