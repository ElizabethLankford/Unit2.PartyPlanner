// URL for API
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events`;

// Declared my state variables
const state = {
  events: [],
};

const eventContainer = document.querySelector("#eventContainer");
const form = document.querySelector("#addEvent");
form.addEventListener("submit", createEvent);

async function init() {
  await fetchEventData();
  render();
}
init();
// async function to fetch the event data from the API
async function fetchEventData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error, could not get data!");
  }
}

// async function to render data after it recieves it from fetch function
async function render() {
  state.events = await fetchEventData();

  if (!state.events.length) {
    eventContainer.innerText = "No events found!";
  }

  state.events.map((event) => {
    const { name, date, location } = event;
    let newDate = new Date(date).toLocaleString();
    const li = document.createElement("li");
    li.innerHTML = `
        <p><b>Event Name:</b> ${name}</p>
        <p><b>Date & Time:</b> ${newDate}</p>
        <p><b>Address: </b>${location}</p>
    `;

    eventContainer.appendChild(li);
  });
}

// Create event then add funciton
async function createEvent(event) {
  try {
    event.preventDefault();
    const eventname = event.target.eventName.value;
    const eventdate = event.target.eventDate.value;
    const eventlocation = event.target.eventAddress.value;

    const newDate = new Date(eventdate).toISOString();
    console.log(eventname, newDate, eventlocation);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: eventname,
        description: "description example",
        date: newDate,
        location: eventlocation,
      }),
    });
    const createdEvent = await response.json();
    console.log(createdEvent);

    if (createdEvent.error) {
      throw new Error(createdEvent.message);
    }
    render();
  } catch (error) {
    console.log(error);
  }
}
// Add event function
/* async function addEvent(event) {
  event.preventDefault();

  const name = event.target.eventName.value;
  const date = event.target.eventDate.value;
  const location = event.target.eventAddress.value;
  await createEvent(name, date, location);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        date: date,
        location: location,
      }),
    });

    const createdEvent = await response.json();
    if (createdEvent.error) {
      throw new Error(createdEvent.message);
    }
    render();
  } catch (error) {
    console.log(error);
  }
}
*/
