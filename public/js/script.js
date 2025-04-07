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
