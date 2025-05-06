// Google Apps Script Web App URL
const apiUrl = "https://script.google.com/macros/s/AKfycbyJ7oI0shpdhmoUwJFcAAlkBkShMc-GJ3e4LJFCmcGEMph1PrBQMmVHCaCSo1p2aPaZZg/exec"; // 替換為你的 Web App URL
 
    const mainCategories = {
      "Rexton系列": ["BiCore RIC","BiCore Rugged","BiCore SR","BiCore 藍芽訂製機","Cros","M-Core BTE","M-Core IX","M-Core RIC","M-Core SR","Reach IX","Reach RIC","Rechagre B-LI-HP","Rechagre B-LI-P","Rechagre R-LI","Stellar Li","Sterling 訂製機","特殊機型","Rexton 8C","Rexton未知新款"],
      "Mimitakara系列": ["A&M","Mimitakara","Mimitakara-6EF/6EN/6SE/6SF","Mimitakara-MFi R1/R2/R3","Mimitakara-口袋機/脖掛機/骨導","Mimitakara-早安","Mimitakara-耳寶三兄弟"],
      "Coselgi系列": ["Coselgi Mojo BTE","Coselgi Mojo RIC","Coselgi BTE 充電款","Coselgi RIC 充電款"],
      "Smart Demo": ["Smart Demo"],
      "助聽器配件": ["A快速分類(DM、提袋、防掉環、電子除濕盒、乾燥罐、磁吸棒、氣導管)","Battery鋅空電池","Charging Station助聽器充電盒","Concha lock固定線","Coselgi V.2 耳管(就是細管)","Coselgi 轉接頭(接細管用的)","Coselgi 電子配件","Electronic電子配件","Fitting零配件","SD 270","手雕機配件","日本耳寶耳內型聲音放大器","服務","特定客戶使用","耳勾Hook","設備-耳窺鏡","連線裝置(Noahlink/Hi Pro/ProLink/調整線/調整靴)","防耳垢裝置","除濕保養乾燥機(含配件)","OTC及不確定的分類","維修部專用"],
      "耳塞及耳模": ["Click 耳塞2.0 Connexx","Click 耳塞2.0 Mimitakara","Ear Plugs耳塞(香菇/各種耳寶/矽膠/海綿)","Eartips & Sleeve 耳塞 3.0","Coselgi 耳塞","耳模及其材料","Tip 耳塞","耳塞包 6S47+6EF"],
      "配件組合包": ["組合-6EF (充電盒+主機+專用喇吧線)","組合-6EN (充電盒+主機)","組合-6SE (充電盒+主機)","組合-6SF (充電盒+主機)","組合-ReCharge(豆腐頭、充電器、底座)"],
      "電子喇吧線": ["Coselgi Wired RIC","Coselgi 充電款喇叭線","MiniReceiver 電子喇吧線 6EF","MiniReceiver 電子喇吧線2.0","MiniReceiver 電子喇吧線2.0 HP","MiniReceiver 電子喇吧線3.0 BiCore"],
      "助聽器外殼": ["外殼 Bi-Core RIC","外殼 Coselgi(含拆卸工具)","外殼 M-Core BTE","外殼 M-Core RIC","外殼 Emerald","外殼 Mosaic"],
      "西門子細管": ["Thin Tube 細管 1.0","Thin Tube 細管 2.0","Thin Tube 細管 3.0"],
      "醫療保健品": ["iCue床墊","亞力田","偉翔生技","大來護具","氧氣機","洗牙機","測利得","滅菌機、空氣清淨機","益生菌、膠囊","血壓計、檯燈","酷式","電影票","驅蚊貼"],
      "系統及優惠": ["系統","優惠券"]
    };

// 取得主容器元素
const container = document.getElementById('main-container');

// 生成 QR Code 的 URL
function generateQRCode(barcode) {
  return `https://api.qrserver.com/v1/create-qr-code/?data=${barcode}&size=100x100`;
}

// 渲染資料至畫面（包含搜尋結果處理）
function renderData(filteredData) {
  container.innerHTML = ''; // 清空主容器

  // 遍歷大分類
  Object.keys(mainCategories).forEach(mainCategory => {
    const mainDiv = document.createElement('div');
    mainDiv.className = 'main-category';

    mainDiv.innerHTML = `
      <h2 class="toggle-header" data-type="category">${mainCategory} <span>&#9660;</span></h2>
      <div class="categories" style="display: none;"></div>
    `;

    const categoriesDiv = mainDiv.querySelector('.categories');

    // 遍歷子分類
    mainCategories[mainCategory].forEach(subCategory => {
      const subCategoryDiv = document.createElement('div');
      subCategoryDiv.className = 'category';

      subCategoryDiv.innerHTML = `
        <h3 class="toggle-header" data-type="items">${subCategory} <span>&#9660;</span></h3>
        <div class="items" style="display: none;"></div>
      `;

      const itemsDiv = subCategoryDiv.querySelector('.items');

      // 過濾符合子分類的資料
      const subCategoryData = filteredData.filter(item => item.category === subCategory);

      // 插入符合的項目
      if (subCategoryData.length > 0) {
        subCategoryData.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'item';
          itemDiv.innerHTML = `
            <div class="qr-code">
              <img src="${generateQRCode(item.barcode)}" alt="QR Code">
            </div>
            <div class="item-details">
              <div><strong>品名規格：</strong>${item.name}</div>
              <div><strong>料號：</strong>${item.partNumber}</div>
              <div><strong>條碼編號：</strong>${item.barcode}</div>
            </div>
          `;
          itemsDiv.appendChild(itemDiv);
        });

        categoriesDiv.appendChild(subCategoryDiv);
      }
    });

    // 只有當大分類有內容時才插入主容器
    if (categoriesDiv.children.length > 0) {
      container.appendChild(mainDiv);
    }
  });

  // 綁定展開/摺疊功能
  bindToggleEvents();
}

// 綁定展開/摺疊事件
function bindToggleEvents() {
  const headers = document.querySelectorAll('.toggle-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const targetType = header.getAttribute('data-type');
      const targetDiv = header.nextElementSibling;
      const icon = header.querySelector('span');

      if (targetDiv.style.display === 'none' || targetDiv.style.display === '') {
        targetDiv.style.display = 'block';
        icon.innerHTML = '&#9650;';
      } else {
        targetDiv.style.display = 'none';
        icon.innerHTML = '&#9660;';
      }
    });
  });
}

// 動態加載資料
function loadData() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      renderData(data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      container.innerHTML = '<p>無法加載資料，請稍後再試。</p>';
    });
}

// 搜尋功能
function filterItems() {
  const searchTerm = document.getElementById('search').value.toLowerCase();

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const filteredData = data.filter(item => 
        item.category.toLowerCase().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.partNumber.toLowerCase().includes(searchTerm) ||
        String(item.barcode).toLowerCase().includes(searchTerm)
      );

      renderData(filteredData);
    })
    .catch(error => {
      console.error("Error filtering data:", error);
    });
}

// 初始化
loadData();
