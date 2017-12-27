function saveOptions(e) {
  e.preventDefault();

  browser.storage.local.set({
    currency: document.getElementById('currency').value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.getElementById('currency').value = result.currency || "USD";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("currency");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
