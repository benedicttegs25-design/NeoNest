document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".product");
    const noResults = document.querySelector(".no-results");

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            let visibleCount = 0;

            products.forEach((product) => {
                const category = product.dataset.category;
                const matches = filter === "all" || category === filter;
                product.classList.toggle("hidden", !matches);
                if (matches) visibleCount++;
            });

            noResults.classList.toggle("show", visibleCount === 0);
        });
    });
});