// URL for API
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events`;

// Declared my state variables
const state = {
  events: [],
};

const eventContainer = document.querySelector("#eventContainer");
const form = document.querySelector("#addEvent");
form.addEventListener("submit", createEvent);

// initiating function
async function init() {
  await fetchEventData();
  await render();
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
        <p><b>Event Name:</b> ${event.name}</p>
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
