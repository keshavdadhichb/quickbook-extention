let scriptActivated = false;
let tabDetails = null;

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "background",
    id: "irctc",
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  
  if (message.id !== "irctc") {
    console.error("Invalid message ID");
    sendResponse({ error: "Invalid Id" });
    return;
  }

  const type = message.msg.type;
  const data = message.msg.data;

  if (type === "activate_script") {
    console.log("Activating script with data:", data);
    
    // Store user data in chrome.storage before creating tab
    chrome.storage.local.set(data).then(() => {
      console.log("Data saved to storage");
      chrome.tabs.create(
        {
          url: "https://www.irctc.co.in/nget/train-search",
        },
        (tab) => {
          tabDetails = tab;
          // Wait for page to load before injecting script
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content_script.js"],
              });
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        }
      );
    });
    sendResponse({ status: "Script activation initiated" });
  }
});

// Monitor tab updates for navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === tabDetails?.id && changeInfo?.status === "complete") {
    console.log("Tab updated:", tab.url);
    
    if (tab.url.includes("booking/train-list")) {
      chrome.tabs.sendMessage(tabDetails.id, getMsg("selectJourney"));
    }
    else if (tab.url.includes("booking/psgninput")) {
      chrome.tabs.sendMessage(tabDetails.id, getMsg("fillPassengerDetails"));
    }
  }
});

// On installing the extension
chrome.runtime.onInstalled.addListener((reason) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "onboarding.html",
    });
  }
});
// chrome.tabs.create(
//   createProperties: object,
//   callback?: function,
// )

// open irctc page  - https://www.irctc.co.in/nget/train-search
// set localStorage for search history of journey
// reload the page
// login the users at 11.00 / 10.00
// set journey details
// click Search

// route changes to - https://www.irctc.co.in/nget/booking/train-list
// select journey class
// select date
// click book now

// route changes - https://www.irctc.co.in/nget/booking/psgninput
// Fill passenger details, contact_details, other details

// route changes - https://www.irctc.co.in/nget/booking/reviewBooking
// Fill captach

// route changes - https://www.irctc.co.in/nget/payment/bkgPaymentOptions
// Fill captach
