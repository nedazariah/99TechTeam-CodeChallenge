import "@tailwindplus/elements";

const currencyInfo = new Map();
const apiUrl = "https://interview.switcheo.com/prices.json";

const baseOptions = document.getElementById("base-options");
const targetOptions = document.getElementById("target-options");

const baseSelected = document.getElementById("base-selected-text");
const targetSelected = document.getElementById("target-selected-text");

const baseAmount = document.getElementById("base-amount");
const targetAmount = document.getElementById("target-amount");

const basePrice = document.getElementById("base-price");
const targetPrice = document.getElementById("target-price");

const baseConfirm = document.getElementById("base-confirmation");
const targetConfirm = document.getElementById("target-confirmation");

const swapButton = document.getElementById("swap-btn");
const confirmButton = document.getElementById("confirm-btn");

const transactionsDiv = document.getElementById("transactions");

function populateSelectOption() {
  for (const [currency, info] of currencyInfo) {
    const baseOption = document.createElement("el-option");
    baseOption.value = currency;
    baseOption.className =
      "group/option relative flex items-center justify-center cursor-default h-[40%] text-white select-none focus:bg-indigo-500 focus:text-white focus:outline-hidden";
    baseOptions.appendChild(baseOption);

    const baseDiv = document.createElement("div");
    baseDiv.className = "flex items-center";
    baseOption.appendChild(baseDiv);

    const baseImg = document.createElement("img");
    baseImg.src = `assets/tokens/${currency}.svg`;
    baseImg.className = "h-5";
    baseDiv.appendChild(baseImg);

    const baseSpan = document.createElement("span");
    baseSpan.className =
      "ml-3 block truncate font-normal group-aria-selected/option:font-semibold";
    baseSpan.textContent = currency;
    baseDiv.appendChild(baseSpan);

    const targetCopy = baseOption.cloneNode(true);
    targetOptions.appendChild(targetCopy);
  }
}

async function getJSONData(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();
    data.forEach((item) => {
      currencyInfo.set(item.currency, {
        price: (Math.trunc(item.price * 100) / 100).toFixed(2),
        date: item.date,
      });
    });
    populateSelectOption();
  } catch (e) {
    console.error("Unable to fetch data: ", e);
  }
}

function updateBaseCurrency(currency) {
  const selectedCurrencyInfo = currencyInfo.get(currency);
  if (!selectedCurrencyInfo) return;

  document.getElementById("base-selected-text").textContent = currency;
  document.getElementById("base-selected-img").src =
    `assets/tokens/${currency}.svg`;
  document.getElementById("base-selected-img").className = "h-5";
  document.getElementById("base-selected-img").style.display = "flex";

  if (baseAmount.value != "0" && baseAmount.value != "") {
    basePrice.innerHTML = `$${(selectedCurrencyInfo.price * baseAmount.value).toFixed(2)}`;
  } else {
    basePrice.innerHTML = `$${selectedCurrencyInfo.price}`;
  }

  if (targetSelected.textContent != "Currency") {
    const targetCurrencyPrice = currencyInfo.get(targetSelected.textContent);
    if (baseAmount.value >= 1) {
      targetAmount.value = (
        (parseFloat(baseAmount.value) *
          parseFloat(selectedCurrencyInfo.price)) /
        targetCurrencyPrice.price
      ).toFixed(2);
    }
  }
}

function updateTargetCurrency(currency) {
  const selectedCurrencyInfo = currencyInfo.get(currency);
  if (!selectedCurrencyInfo) return;

  document.getElementById("target-selected-text").textContent = currency;
  document.getElementById("target-selected-img").src = `assets/tokens/${currency}.svg`;
  document.getElementById("target-selected-img").className = "h-5";
  document.getElementById("target-selected-img").style.display = "flex";


  targetPrice.innerHTML = `$${selectedCurrencyInfo.price}`;

  if (baseAmount.value != "0" && baseAmount.value != "") {
    const targetTotal =
      parseFloat(basePrice.innerText.slice(1)) / selectedCurrencyInfo.price;
    targetAmount.value = targetTotal.toFixed(2);
  } else {
    targetAmount.value = "";
  }
}

function validateForm() {
  if (
    baseAmount.value != "" &&
    baseAmount.value != "0" &&
    baseSelected.textContent != "Currency" &&
    targetSelected.textContent != "Currency" &&
    baseSelected.textContent != targetSelected.textContent
  ) {
    swapButton.classList.remove("disabled");
    baseConfirm.textContent = baseSelected.textContent;
    targetConfirm.textContent = targetSelected.textContent;
  } else {
    swapButton.classList.add("disabled");
  }
}

function insertTransaction(base, target) {
  const transactionLog = document.createElement("div");
  const currencyIcons = document.createElement("div");
  const transactionDetails = document.createElement("div");
  const arrowSVG = 
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>`;
  const status = document.createElement("div");

  transactionLog.className = "transaction-log";
  currencyIcons.className = "currency-icons";
  transactionDetails.className = "transaction-details";
  status.className = "status";

  const currencyIconsBase = document.createElement("img");
  currencyIconsBase.src = `assets/tokens/${base.textContent}.svg`;
  const currencyIconsTarget = document.createElement("img");  
  currencyIconsTarget.src = `assets/tokens/${target.textContent}.svg`;

  currencyIcons.appendChild(currencyIconsBase);
  currencyIcons.appendChild(currencyIconsTarget);

  const baseSpan = document.createElement("span");
  const targetSpan = document.createElement("span");

  baseSpan.textContent = base.textContent;
  targetSpan.textContent = target.textContent;

  transactionDetails.appendChild(baseSpan);
  transactionDetails.innerHTML += arrowSVG;
  transactionDetails.appendChild(targetSpan);

  status.textContent = "Completed";

  transactionsDiv.prepend(transactionLog);
  transactionLog.appendChild(currencyIcons);
  transactionLog.appendChild(transactionDetails);
  transactionLog.appendChild(status);

  resetForm();
  validateForm();
}

function resetForm() {
  baseAmount.value = "1";
  targetAmount.value = "";
  basePrice.textContent = "";
  targetPrice.textContent = "";
  baseSelected.textContent = "Currency";
  document.getElementById("base-selected-img").style.display = "none";
  targetSelected.textContent = "Currency";
  document.getElementById("target-selected-img").style.display = "none";
}

getJSONData(apiUrl);

baseAmount.addEventListener("input", (event) => {
  const userInput = event.target.value;

  const selectedCurrency = baseSelected.textContent;
  const targetCurrency = targetSelected.textContent;

  if (selectedCurrency != "Currency") {
    const currencyPrice = currencyInfo.get(selectedCurrency);
    basePrice.innerHTML = `$${currencyPrice.price}`;
  }
  if (selectedCurrency != "Currency" && userInput > 1) {
    const currencyPrice = currencyInfo.get(selectedCurrency);
    const totalValue = parseFloat(userInput) * parseFloat(currencyPrice.price);
    basePrice.innerHTML = `$${totalValue.toFixed(2)}`;
  }
  if (selectedCurrency != "Currency" && targetCurrency != "Currency") {
    const currencyPrice = currencyInfo.get(selectedCurrency);
    const targetCurrencyPrice = currencyInfo.get(targetCurrency);
    const totalValue = parseFloat(userInput) * parseFloat(currencyPrice.price);
    const targetTotal = totalValue / targetCurrencyPrice.price;
    if (userInput >= 1) {
      targetAmount.value = targetTotal.toFixed(2);
    } else {
      targetAmount.value = "";
    }
  }

  validateForm();
});

document.getElementById("base-options").addEventListener("click", (e) => {
  const option = e.target.closest("el-option");
  if (option) {
    updateBaseCurrency(option.textContent.trim());
  }
  validateForm();
});

document.getElementById("target-options").addEventListener("click", (e) => {
  const option = e.target.closest("el-option");
  if (option) {
    updateTargetCurrency(option.textContent.trim());
  }
  validateForm();
});

document.getElementById("center-swap").addEventListener("click", (e) => {
  if (
    baseSelected.textContent != "Currency" &&
    targetSelected.textContent != "Currency"
  ) {
    const tempCurrency = baseSelected.textContent;
    baseConfirm.textContent = targetSelected.textContent;
    targetConfirm.textContent = tempCurrency;
    updateBaseCurrency(targetSelected.textContent);
    updateTargetCurrency(tempCurrency);
  }
  validateForm()
});

document.getElementById("reset").addEventListener("click", (e) => {
  resetForm();
  validateForm();
})

confirmButton.addEventListener("click", (event) => {

  const swapText = document.getElementById("swap-text");
  swapText.textContent = "Swapping...";

  const spinner = document.getElementById("spinner");
  spinner.classList.remove('hidden');
  confirmButton.disabled = true;

  const dialog = document.getElementById("dialog");

  setTimeout(() => {
    spinner.classList.add('hidden');
    confirmButton.disabled = false;
    swapText.textContent = "Swap";
    insertTransaction(baseSelected, targetSelected);
    dialog.close();
  }, 3000); 
  
});
