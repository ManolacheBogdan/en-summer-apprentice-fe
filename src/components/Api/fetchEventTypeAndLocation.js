export async function fetchLocationData() {
  try {
    const response = await fetch('http://localhost:8080/events/locations');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fetchLocationData = await response.json();
    return fetchLocationData;
  } catch (error) {
    console.error('Error fetching location options:', error);
    return [];
  }
}

export async function fetchEventTypeData() {
  try {
    const response = await fetch('http://localhost:8080/events/eventTypes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fetchEventTypeData = await response.json();
    return fetchEventTypeData;
  } catch (error) {
    console.error('Error fetching event type options:', error);
    return [];
  }
}

export async function fetchFilteredEventData(selectedEventType, selectedLocation) {
  try {
    const response = await fetch(`http://localhost:8080/events/byTypeAndLocationName?eventTypeName=${selectedEventType}&locationName=${selectedLocation}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const fetchFilteredEventData = await response.json();
    return fetchFilteredEventData;
  } catch (error) {
    console.error('Error fetching event data options:', error);
    return [];
  }
}



