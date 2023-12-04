// URL for API
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events`;
const API = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF`;

// Declared my state variables
const state = {
  events: [],
  event: null,
  guests: [],
  rsvps: [],
};

const eventContainer = document.querySelector("#eventContainer");
const form = document.querySelector("#addEvent");
const guestEl = document.querySelector("#guestInfo");
const eventEl = document.querySelector("#eventInfo");
const guestList = document.querySelector("#guestList");

form.addEventListener("submit", createEvent);

window.addEventListener("hashchange", selectEvent);
// initiating function
async function init() {
  await fetchEventData();
  await render();
  await getGuests();
  await getRsvps();

  selectEvent();
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

  const eventItems = state.events.map((event) => {
    let newDate = new Date(event.date).toLocaleString();
    const li = document.createElement("li");
    li.innerHTML = `
        <p><b>Event Name:</b><a href=#${event.id}> ${event.name}</a></p>
        <p><b>Date & Time:</b> ${newDate}</p>
        <p><b>Address: </b>${event.location}</p>
    `;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Event";
    li.append(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit Event";
    li.append(editBtn);

    deleteBtn.addEventListener("click", () => deleteEvent(event.id));
    editBtn.addEventListener("click", () => editEvent(event.id));
    return li;
  });
  eventContainer.replaceChildren(...eventItems);
  console.log(state.events);
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
    form.reset();

    if (createdEvent.error) {
      throw new Error(createdEvent.message);
    }
  } catch (error) {
    console.log(error);
  }

  init();
}

//Delete event function

async function deleteEvent(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    console.log("Delete btn pressed", id);
  } catch (error) {
    console.log(error);
  }

  init();
}

// Edit event function

async function editEvent(id) {
  try {
    console.log("edit btn clicked", id);
    const newDate = new Date(form.eventDate.value).toISOString();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.eventName.value,
        description: "description example",
        date: newDate,
        location: form.eventAddress.value,
      }),
    });
    const editedEventResponse = await response.json();
    if (editedEventResponse.error) {
      throw new Error(editedEventResponse.message);
    }
    init();
    form.reset();
  } catch (error) {
    console.log(error);
  }
}
//get guest function

async function getGuests() {
  try {
    const response = await fetch(`${API}/guests`);
    const json = await response.json();
    state.guests = json.data;
  } catch (error) {
    console.log(error);
  }
}

// render list of guest
function renderGuests() {
  const rsvps = state.rsvps.filter((rsvp) => rsvp.eventId === state.event.id);
  const guestIds = rsvps.map((rsvp) => rsvp.guestId);
  const guests = state.guests.filter((guest) => guestIds.includes(guest.id));

  if (!guests.length) {
    guestList.innerHTML = `
<li>No guests yet!</li>
    `;
  }

  const guestListArr = guests.map((guest) => {
    const guestInfo = document.createElement("li");
    guestInfo.innerHTML = `
      <span>${guest.name}</span>
      <span>${guest.email}</span>
      <span>${guest.phone}</span>
    `;

    return guestInfo;
  });
  guestEl.replaceChildren(...guestListArr);
}

// get list of rsvps
async function getRsvps() {
  try {
    const response = await fetch(`${API}/rsvps`);
    const json = await response.json();
    state.rsvps = json.data;
  } catch (error) {
    console.log(error);
  }
}

// selecting an event function
function selectEvent() {
  const id = window.location.hash.slice(1);
  state.event = state.events.find((event) => event.id === +id);

  if (!state.event) {
    eventEl.innerHTML = "<p>Select an event to see guest information.</p>";
  }
  const newDate = new Date(state.event.date);
  eventEl.innerHTML = `
  <h3>${state.event.name}</h3>
  <p><b>Date & Time:</b> ${newDate.toLocaleString()}</p>
  <p><b>Address: </b>${state.event.location}</p>
  <p>${state.event.description}</p>
  
  `;
  renderGuests();
}
