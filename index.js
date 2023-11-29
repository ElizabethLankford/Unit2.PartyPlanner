const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2310-GHP-ET-WEB-FT-SF/events`;

const state = {
  events: [],
};

const eventContainer = document.querySelector("#eventContainer");

async function fetchEventData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("Error, could not get data!");
  }
}

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
        <h3>Event Name: ${name}</h3>
        <p>Date & Time: ${newDate}</p>
        <address>${location}</address>
    `;

    eventContainer.appendChild(li);
  });
}

render();
