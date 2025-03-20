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

// Button delete
// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const confim = confirm("Bạn có chắc chắn muốn xóa bản ghi này ?");
      if (confim) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        console.log(action);
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
// End Button delete
