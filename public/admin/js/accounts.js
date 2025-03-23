// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const currentStatus = button.getAttribute("data-status");
      const newStatus = currentStatus == "active" ? "inactive" : "active";

      formChangeStatus.action = `${path}/${id}/${newStatus}?_method=PATCH`;
      formChangeStatus.submit();
    });
  });
}
// End Change status

// Delete item
const buttonDetele = document.querySelectorAll("[button-delete]");
if (buttonDetele.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonDetele.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa tài khoản này ?");

      if (!isConfirm) {
        return;
      }

      const id = button.getAttribute("data-id");

      formDeleteItem.action = `${path}/${id}?_method=DELETE`;
      formDeleteItem.submit();
    });
  });
}
// End Delete item
