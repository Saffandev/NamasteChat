const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageinput = document.getElementById("massageinp");
const messagecontainer = document.querySelector(".chat-messages");
var audio = new Audio("notify.mp3");

const append = (message, position, sname) => {
  const messageElement = document.createElement("div");

  if (position != "center") {
    messageElement.innerHTML = `<div><img src='https://bootdey.com/img/Content/avatar/avatar1.png' class='rounded-circle mr-1' alt='Chris Wood' width='40' height='40'><div class='text-muted small text-nowrap mt-2'>2:33 am</div></div><div class='flex-shrink-1 bg-light rounded py-2 px-3 mr-3'><div class='font-weight-bold mb-1'>${sname}</div>${message}</div>`;
  } else {
      messageElement.innerHTML = `<div><div class="text-muted small bg-light mt-2">${message}</div></div>`
  }

  messageElement.classList.add("message");

  if (position == "left") {
    messageElement.classList.add("chat-message-left");
    messageElement.classList.add("pb-4");
  }

  else if (position == "center") {
    messageElement.classList.add("chat-message-center");
    messageElement.classList.add("pb-4");
  }
  else {
    messageElement.classList.add("chat-message-right");
    messageElement.classList.add("pb-4");
  }

  messagecontainer.appendChild(messageElement);

  if (position == "left") {
    audio.play();
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if(messageinput.value != "") {
    const message = messageinput.value;
    append(`${message}`, "right", "You");
    socket.emit("send", message);
    messageinput.value = "";
    updateScroll();
  }
});

const sname = prompt("Enter your name to join");
socket.emit("new-user-joined", sname);

document.getElementById("username").innerHTML = sname;

socket.on("user-joined", (sname) => {
  append(`${sname} joined the chat`, "center");
});

socket.on("receive", (data) => {
  append(`${data.message}`, "left", `${data.name}`);
});

socket.on("left", (name) => {
  append(`${name} left the chat`, "center");
});

function updateScroll(){
  var element = document.getElementById("maindiv");
  element.scrollTop = element.scrollHeight;
}