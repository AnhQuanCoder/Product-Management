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
