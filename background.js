chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("fliphtml5.com")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } else {
    console.log("Bu eklenti sadece FlipHTML5 sayfalarında çalışır.");
  }
});