// Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href); // lấy đường dẫn url

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      console.log(button);
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status); // thêm params vào đường dẫn
      } else {
        url.searchParams.delete("status"); // xóa params khỏi đường dẫn
      }

      window.location.href = url.href; // câu lệnh chuyển hướng sang trang khác
    });
  });
}
// End button status

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href); // lấy đường dẫn url

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // ngăn chặn việc chuyển hướng của trang khi click button submit
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword); // thêm params vào đường dẫn
    } else {
      url.searchParams.delete("keyword"); // xóa params khỏi đường dẫn
    }

    window.location.href = url.href; // câu lệnh chuyển hướng sang trang khác
  });
}
// End form search

// Pagination
const buttonPaginations = document.querySelectorAll("[button-pagination]");

if (buttonPaginations) {
  let url = new URL(window.location.href); // lấy đường dẫn url

  buttonPaginations.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      if (page) {
        url.searchParams.set("page", page); // thêm params vào đường dẫn
      } else {
        url.searchParams.delete("page"); // xóa params khỏi đường dẫn
      }
      window.location.href = url.href; // câu lệnh chuyển hướng sang trang khác
    });
  });
}
// End pagination

// Checkbox multi
const checkboxMulti = document.querySelector("[check-box-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      // Lọc ra những ô checkbox đang được chọn
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// End checkbox multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[check-box-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    if (typeChange == "delete-all") {
      const isConfirm = confirm(
        "Bạn có chắc chắc muốn xóa những bản ghi này ?"
      );

      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi");
    }
  });
}
// End form change multi

// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));

  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
    });
  }
}
// End show alert

// Upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  const closeImage = uploadImage.querySelector("[close-image]");

  if (uploadImageInput && uploadImagePreview && closeImage) {
    uploadImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        uploadImagePreview.src = URL.createObjectURL(file);
        closeImage.classList.remove("d-none");
      }
    });

    closeImage.addEventListener("click", () => {
      uploadImagePreview.src = "";
      uploadImageInput.value = "";
      closeImage.classList.add("d-none");
    });
  }
}
// End upload image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  let url = new URL(window.location.href); // lấy đường dẫn url

  // Sort
  sortSelect.addEventListener("change", (e) => {
    const [sortKey, sortValue] = e.target.value.split("-");
    console.log(sortKey);
    console.log(sortValue);

    if (sortKey && sortValue) {
      url.searchParams.set("sortKey", sortKey); // thêm params vào đường dẫn
      url.searchParams.set("sortValue", sortValue);
    }

    window.location.href = url.href; // câu lệnh chuyển hướng sang trang khác
  });

  // Clear sort
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });

  // Thêm selected cho option
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  if (sortValue && sortKey) {
    const strSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value=${strSort}]`);
    optionSelected.selected = true;
  }
}
// End sort
