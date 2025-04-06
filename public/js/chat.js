import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formMessage = document.querySelector(".chat .inner-form");
if (formMessage) {
  formMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";

      clearTimeout(timeOut);
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");

  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  let htmlFullname = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullname = `<div class="inner-name">${data.fullName}</div>`;
  }
  div.innerHTML = `
    ${htmlFullname}
    <div class="inner-content">${data.content}</div>
  `;

  body.insertBefore(div, boxTyping);

  body.scrollTop = body.scrollHeight;
});
// End SERVER_RETURN_MESSAGE

// Scroll chat bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End scroll chat bottom

// Emoji picker

// Show popup icon
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

// Show typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
// End Show typing

// Insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputContent = document.querySelector(
    ".chat .inner-foot input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    inputContent.value = inputContent.value + icon;

    const end = inputContent.value.length;
    inputContent.setSelectionRange(end, end);
    inputContent.focus();

    showTyping();
  });

  inputContent.addEventListener("keyup", () => {
    showTyping();
  });
}
// End emoji picker

// SERVER_SEND_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_SEND_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id='${data.userId}']`
      );

      if (!existTyping) {
        const boxTyping = document.createElement("div");
        const bodyChat = document.querySelector(".chat .inner-body");

        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span> </span>
          <span> </span>
          <span></span>
        </div>
      `;

        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxRemove = elementListTyping.querySelector(
        `[user-id='${data.userId}']`
      );
      if (boxRemove) {
        elementListTyping.removeChild(boxRemove);
      }
    }
  });
}
// End SERVER_SEND_TYPING
