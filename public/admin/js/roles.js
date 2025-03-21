// Delete item
const buttonDelete = document.querySelectorAll("[button-delete-item]");
if (buttonDelete.length > 0) {
  const formDelete = document.querySelector("#form-delete-item");
  const path = formDelete.getAttribute("data-path");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", (e) => {
      const isConfirm = confirm("Bạn có chắc muốn xóa quyền này ?");
      if (!isConfirm) {
        return;
      }

      const id = button.getAttribute("data-id");
      const action = `${path}/${id}?_method=DELETE`;

      formDelete.action = action;
      formDelete.submit();
    });
  });
}
// End delete item

// Permissions
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermission.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;

          // console.log(name);
          // console.log(index);
          // console.log(checked);
          // console.log("-------------------");

          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }

      console.log(permissions);

      if (permissions.length > 0) {
        const formChangePermissions = document.querySelector(
          "#form-change-permissions"
        );
        const inputPermissions = formChangePermissions.querySelector(
          "input[name='permissions']"
        );
        inputPermissions.value = JSON.stringify(permissions);
        formChangePermissions.submit();
      }
    });
  });
}
// End Permissions

// Permissions data default
const dataPermissions = document.querySelector("[data-permissions]");
if (dataPermissions) {
  const dataRecord = JSON.parse(
    dataPermissions.getAttribute("data-permissions")
  );

  const tablePermission = document.querySelector("[table-permissions]");

  dataRecord.forEach((item, index) => {
    const permissions = item.permisstions;

    permissions.forEach((permission) => {
      const row = tablePermission.querySelector(`[data-name=${permission}]`);
      const input = row.querySelectorAll("input")[index];

      input.checked = true;
    });
  });
}
// End permissions data default
