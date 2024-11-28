// 初始化頁面內容
document.addEventListener("DOMContentLoaded", () => {
    renderCategories(data); // 直接從 data.js 中取得資料
});

// 渲染分類內容
function renderCategories(data) {
    const categoriesContainer = document.getElementById("categories");

    // 按分類分組
    const categoriesMap = data.reduce((map, item) => {
        if (!map[item.category]) {
            map[item.category] = [];
        }
        map[item.category].push(item);
        return map;
    }, {});

    // 渲染每個分類
    for (const [categoryName, items] of Object.entries(categoriesMap)) {
        // 創建分類容器
        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("category");

        // 分類標題
        const categoryHeader = document.createElement("div");
        categoryHeader.classList.add("category-header");
        categoryHeader.textContent = categoryName;
        categoryHeader.onclick = () => {
            const itemsDiv = categoryDiv.querySelector(".category-items");
            itemsDiv.style.display = itemsDiv.style.display === "block" ? "none" : "block";
        };

        // 分類項目
        const itemsDiv = document.createElement("div");
        itemsDiv.classList.add("category-items");

        items.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            itemDiv.setAttribute("data-name", item.name.toLowerCase());
            itemDiv.setAttribute("data-barcode", item.barcode.toString());

            const qrDiv = document.createElement("div");
            qrDiv.classList.add("qr-code");

            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("item-details");
            detailsDiv.innerHTML = `
                <div class="title">品名規格: ${item.name}</div>
                <div>料號: ${item.partNumber}</div>
                <div>條碼編號: ${item.barcode}</div>
            `;

            itemDiv.appendChild(qrDiv);
            itemDiv.appendChild(detailsDiv);
            itemsDiv.appendChild(itemDiv);

            // 生成 QR Code
            new QRCode(qrDiv, {
                text: item.barcode.toString(),
                width: 100,
                height: 100
            });
        });

        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(itemsDiv);
        categoriesContainer.appendChild(categoryDiv);
    }
}

// 搜尋功能
function filterItems() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll(".item");
    items.forEach(item => {
        const name = item.getAttribute("data-name");
        const barcode = item.getAttribute("data-barcode");
        item.style.display = name.includes(input) || barcode.includes(input) ? "flex" : "none";
    });
}
