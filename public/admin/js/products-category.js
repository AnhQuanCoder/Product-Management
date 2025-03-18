// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach((item) => {
    item.addEventListener("click", (e) => {
      const id = item.getAttribute("data-id");
      const currentStatus = item.getAttribute("data-status");

      let newStatus = currentStatus == "active" ? "inactive" : "active";
      const action = `${path}/${newStatus}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
// End Change status
