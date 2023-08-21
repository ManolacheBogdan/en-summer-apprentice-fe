import { formatDate } from '../utils';
import {useStyle} from './styles';
import { addLoader, removeLoader } from './loader';

export function renderEventCard(event){
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
    console.log("events", event);
    const eventIndex = event.eventID; 
      const contentMarkup = `
      <header>
        <h2 class="event-title text-2xl font-bold">${event.name}</h2>
      </header>
      <div class="content">
        <img src="${eventImageUrls[eventIndex] || 'URL_IMAGINE_LIPSA'}" alt="${name}" class="event-image w-full height-200 rounded object-cover mb-4">
        <p class="description text-gray-700">${description}</p>
        <p class="eventType">Tip eveniment: ${event.eventTypeName}</p> 
        <p class="location">Locatie: ${event.location.name}</p>
        <p class="date">${formatDate(startDate)} - ${formatDate(endDate)}</p>
        <label for="ticketCategories">Select ticket category:</label>
        <select name="ticketCategories" id="ticketCategories-${event.eventID}">
        <option value="${ticketCategories[0].ticketCategoryID}">${ticketCategories[0].ticketDescription} </option>
        <option value="${ticketCategories[1].ticketCategoryID}">${ticketCategories[1].ticketDescription} </option>
        </select>
      </div>
    `;
    eventCard.innerHTML = contentMarkup;
  //console.log("ticket", typeof ticketCategories[0].ticketCategoryID);
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
  //    console.log("type", typeof ticketId);
      postOrder(event.eventID, ticketId, input);
    });

    eventCard.appendChild(input);
    eventCard.appendChild(addToCart);
    return eventCard;
}
  
function postOrder(id, ticketID, input){
    const numberOfTickets = input.value;
    if (parseInt(numberOfTickets)) {
    addLoader();
    fetch('http://localhost:8080/orders', {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        eventID: id, 
        ticketCategoryID: +ticketID,
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