// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
console.log(buttonChangeStatus);
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const currentStatus = button.getAttribute("data-status");

      let newStatus = currentStatus == "active" ? "inactive" : "active";

      const action = path + `/${newStatus}/${id}?_method=PATCH`;

      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
// End change status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDelete = document.querySelector("#form-delete-item");
  const path = formDelete.getAttribute("data-path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const confim = confirm("Bạn có chắc chắn muốn xóa bản ghi này ?");

      if (confim) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;

        formDelete.action = action;
        formDelete.submit();
      }
    });
  });
}
// End Delete Item
