// URL for API
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events`;

// Declared my state variables
const state = {
  events: [],
};

const eventContainer = document.querySelector("#eventContainer");

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

render();
