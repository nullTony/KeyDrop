const filterHeaders = document.querySelectorAll("#filter_header");

filterHeaders.forEach(header => {
    header.addEventListener("click", () => {
        const parent = header.closest('#filter_section');
        parent.classList.toggle("is-open");
    });
});

const filterBtn = document.querySelector(".filterBtn");
const productCon = document.querySelector(".products_container");
if (filterBtn && productCon) {
    filterBtn.addEventListener("click", () => {
        productCon.classList.toggle("is-filter-open");
    });
}