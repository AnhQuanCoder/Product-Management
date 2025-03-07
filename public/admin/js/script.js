// Button status
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);    // lấy đường dẫn url

    buttonStatus.forEach((button) => {
        button.addEventListener('click', () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status); // thêm params vào đường dẫn
            }   else {
                url.searchParams.delete("status");// xóa params khỏi đường dẫn
            }

            window.location.href = url.href;    // câu lệnh chuyển hướng sang trang khác
        })
    })
}
// End button status

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);    // lấy đường dẫn url

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault(); // ngăn chặn việc chuyển hướng của trang khi click button submit
        const keyword = e.target.elements.keyword.value;
        
        if (keyword) {
            url.searchParams.set("keyword", keyword); // thêm params vào đường dẫn
        }   else {
            url.searchParams.delete("keyword");// xóa params khỏi đường dẫn
        }

        window.location.href = url.href;    // câu lệnh chuyển hướng sang trang khác
    })
}
// End form search

// Pagination
const buttonPaginations = document.querySelectorAll("[button-pagination]");

if (buttonPaginations) {
    let url = new URL(window.location.href);    // lấy đường dẫn url

    buttonPaginations.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination"); 
    
            if (page) {
                url.searchParams.set("page", page); // thêm params vào đường dẫn
            }   else {
                url.searchParams.delete("page");// xóa params khỏi đường dẫn
            }
            window.location.href = url.href;    // câu lệnh chuyển hướng sang trang khác
        });
    });
}
// End pagination