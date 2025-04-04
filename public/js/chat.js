// CLIENT_SEND_MESSAGE
const formMessage = document.querySelector(".chat .inner-form");
if (formMessage) {
  formMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
// End CLIENT_SEND_MESSAGE
