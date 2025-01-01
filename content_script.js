let user_data = {};
let retryCount = 0;
const MAX_RETRIES = 3;

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "content_script",
    id: "irctc",
  };
}
function statusUpdate(status) {
  chrome.runtime.sendMessage(
    getMsg("status_update", { status, time: Date.now() })
  );
}

function addDelay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message, sender, "content_script");
  if (message.id !== "irctc") {
    sendResponse("Invalid Id");
    return;
  }
  const type = message.msg.type;
  if (type === "selectJourney") {
    addDelay(200);
    selectJourney();
  } else if (type === "fillPassengerDetails") {
    addDelay(200);
    fillPassengerDetails();
  }
  sendResponse("Something went wrong");
});

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (isElementVisible(element)) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Element ${selector} not found or not visible after ${timeout}ms`));
        return;
      }
      
      requestAnimationFrame(checkElement);
    };
    
    checkElement();
  });
}

async function loadLoginDetails() {
  try {
    statusUpdate("login_started");
    
    const loginModal = await waitForElement("#divMain > app-login");
    const userNameInput = await waitForElement("input[formcontrolname='userid']");
    const passwordInput = await waitForElement("input[formcontrolname='password']");
    
    // Add small delay between actions
    await new Promise(r => setTimeout(r, 500));
    
    userNameInput.value = user_data.irctc_credentials.user_name || "";
    userNameInput.dispatchEvent(new Event("input"));
    userNameInput.dispatchEvent(new Event("change"));
    
    await new Promise(r => setTimeout(r, 500));
    
    passwordInput.value = user_data.irctc_credentials.password || "";
    passwordInput.dispatchEvent(new Event("input"));
    passwordInput.dispatchEvent(new Event("change"));
    
    statusUpdate("login_pending");
    
    // Find and click the submit button
    const submitBtn = await waitForElement("button[type='submit']");
    submitBtn.click();
    
  } catch (error) {
    console.error("Login error:", error);
    statusUpdate("login_failed");
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(loadLoginDetails, 2000);
    }
  }
}

function verifyUserData() {
  if (!user_data || !user_data.irctc_credentials || !user_data.journey_details) {
    console.error('Invalid or missing user data:', user_data);
    return false;
  }
  return true;
}

async function loadJourneyDetails() {
  try {
    if (!verifyUserData()) {
      throw new Error('Invalid user data');
    }

    statusUpdate("filling_journey_details");
    
    // Wait for form elements
    const form = await waitForElement("app-jp-input form");
    const fromInputField = await waitForElement("#origin > span > input");
    const destinationInputField = await waitForElement("#destination > span > input");
    const dateInputField = await waitForElement("#jDate > span > input");
    
    // Fill from station
    fromInputField.value = user_data.journey_details.from
      ? `${user_data.journey_details.from.english_label} - ${user_data.journey_details.from.station_code}`
      : "";
    fromInputField.dispatchEvent(new Event("input", { bubbles: true }));
    fromInputField.dispatchEvent(new Event("change", { bubbles: true }));
    
    await new Promise(r => setTimeout(r, 500));
    
    // Fill destination station
    destinationInputField.value = user_data.journey_details.destination
      ? `${user_data.journey_details.destination.english_label} - ${user_data.journey_details.destination.station_code}`
      : "";
    destinationInputField.dispatchEvent(new Event("input", { bubbles: true }));
    destinationInputField.dispatchEvent(new Event("change", { bubbles: true }));
    
    await new Promise(r => setTimeout(r, 500));
    
    // Fill date
    if (user_data.journey_details.date) {
      const formattedDate = user_data.journey_details.date.split("-").reverse().join("/");
      dateInputField.value = formattedDate;
      dateInputField.dispatchEvent(new Event("input", { bubbles: true }));
      dateInputField.dispatchEvent(new Event("change", { bubbles: true }));
    }
    
    await new Promise(r => setTimeout(r, 500));

    // Handle class selection
    if (user_data.journey_details.class) {
      const jClassField = await waitForElement("#journeyClass");
      const jClassArrowBtn = jClassField.querySelector("div > div[role='button']");
      jClassArrowBtn.click();
      
      await new Promise(r => setTimeout(r, 500));
      
      const classOption = [...jClassField.querySelectorAll("ul li")]
        .find(e => e.innerText === user_data.journey_details.class.label);
      
      if (classOption) {
        classOption.click();
      }
    }

    statusUpdate("filled_journey_details");
    
    // Click search button
    const searchBtn = await waitForElement("button.search_btn.train_Search[type='submit']");
    searchBtn.click();

  } catch (error) {
    console.error('Error in loadJourneyDetails:', error);
    statusUpdate("journey_details_failed");
  }
}

function selectJourney() {
  if (!user_data["journey_details"]["train-no"]) return;

  statusUpdate("journey_selection_started");
  const train_list_parent = document.querySelector(
    "#divMain > div > app-train-list"
  );
  const train_list = [
    ...train_list_parent.querySelectorAll(".tbis-div app-train-avl-enq"),
  ];
  console.log(user_data["journey_details"]["train-no"]);
  const myTrain = train_list.filter((train) =>
    train
      .querySelector("div.train-heading")
      .innerText.trim()
      .includes(user_data["journey_details"]["train-no"])
  )[0];

  if (!myTrain) {
    statusUpdate("journey_selection_stopped.no_train");
    return;
  }

  const jClass = user_data["journey_details"]["class"]["label"];
  const tempDate = new Date(user_data["journey_details"]["date"])
    .toString()
    .split(" ");
  const myClassToClick = [
    ...myTrain.querySelectorAll("table tr td div.pre-avl"),
  ].filter((c) => c.querySelector("div").innerText === jClass)[0];

  const config = { attributes: false, childList: true, subtree: true };
  [...myTrain.querySelectorAll("table tr td div.pre-avl")]
    .filter((c) => c.querySelector("div").innerText === jClass)[0]
    ?.click();

  const fetchAvailableSeatsCallback = (mutationList, observer) => {
    console.log("fetchAvailableSeatsCallback -1", Date.now());
    addDelay(800);
    console.log("fetchAvailableSeatsCallback -2", Date.now());
    const myClassToClick = [
      ...myTrain.querySelectorAll("table tr td div.pre-avl"),
    ].filter((c) => c.querySelector("div").innerText === jClass)[0];
    const myClassTabToClick = [
      ...myTrain.querySelectorAll(
        "div p-tabmenu ul[role='tablist'] li[role='tab']"
      ),
    ].filter((c) => c.querySelector("div").innerText === jClass)[0];
    const myClassTabToSelect = [
      ...myTrain.querySelectorAll("div div table td div.pre-avl"),
    ].filter(
      (c) =>
        c.querySelector("div").innerText ===
        `${tempDate[0]}, ${tempDate[2]} ${tempDate[1]}`
    )[0];

    const bookBtn = myTrain.querySelector(
      "button.btnDefault.train_Search.ng-star-inserted"
    );
    if (myClassToClick) {
      console.log(1);
      if (myClassToClick.classList.contains("selected-class")) {
        console.log(2);
        statusUpdate("journey_selection_completed");
        addDelay(300);
        bookBtn.click();
        observer.disconnect();
      } else {
        console.log(3);
        addDelay(300);
        myClassToClick.click();
      }
    } else if (myClassTabToClick) {
      console.log(4);
      if (!myClassTabToClick.classList.contains("ui-state-active")) {
        console.log(5);
        addDelay(300);
        myClassTabToClick.click();
        return;
      } else if (myClassTabToSelect) {
        console.log(6);
        if (myClassTabToSelect.classList.contains("selected-class")) {
          console.log(7);
          addDelay(500);
          bookBtn.click();
          observer.disconnect();
        } else {
          console.log(8, Date.now());
          addDelay(500);
          myClassTabToSelect.click();
          console.log(9, Date.now());
        }
      }
    }
  };
  const observer = new MutationObserver(fetchAvailableSeatsCallback);
  observer.observe(myTrain, config);
}

async function fillPassengerDetails() {
  try {
    if (!verifyUserData() || !user_data.passenger_details?.length) {
      throw new Error('No passenger details found');
    }

    statusUpdate("filling_passenger_details");
    
    // Wait for the passenger form to be available
    const passengerForm = await waitForElement("#psgn-form");
    if (!passengerForm) {
      throw new Error('Passenger form not found');
    }

    // Process each passenger
    for (let i = 0; i < user_data.passenger_details.length; i++) {
      const passenger = user_data.passenger_details[i];
      const index = i + 1;

      try {
        // Name field - using the PrimeNG specific selectors
        const nameField = await waitForElement(`input[aria-controls="pr_id_${8 + i}_list"]`);
        nameField.value = passenger.name;
        nameField.dispatchEvent(new Event('input', { bubbles: true }));
        nameField.dispatchEvent(new Event('change', { bubbles: true }));
        // Additional events for Angular binding
        nameField.dispatchEvent(new Event('focus', { bubbles: true }));
        nameField.dispatchEvent(new Event('blur', { bubbles: true }));
        await new Promise(r => setTimeout(r, 500));

        // Age field - using aria attributes
        const ageField = await waitForElement(`input[placeholder="Age"]`);
        ageField.value = passenger.age;
        ageField.dispatchEvent(new Event('input', { bubbles: true }));
        ageField.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(r => setTimeout(r, 500));

        // Gender field - using PrimeNG dropdown
        const genderDropdown = await waitForElement(`#psgn-gender${index}`);
        if (genderDropdown) {
          // Click to open dropdown
          genderDropdown.click();
          await new Promise(r => setTimeout(r, 300));
          
          // Find and click the correct option
          const genderValue = passenger.gender || 'M';
          const genderOption = document.querySelector(`li[aria-label="${genderValue}"]`);
          if (genderOption) {
            genderOption.click();
            await new Promise(r => setTimeout(r, 300));
          }
        }

        // Berth preference
        if (passenger.berth) {
          const berthDropdown = await waitForElement(`#psgn-berth-choice${index}`);
          if (berthDropdown) {
            berthDropdown.click();
            await new Promise(r => setTimeout(r, 300));
            
            const berthOption = document.querySelector(`li[aria-label="${passenger.berth}"]`);
            if (berthOption) {
              berthOption.click();
              await new Promise(r => setTimeout(r, 300));
            }
          }
        }

        // Nationality
        const nationalityDropdown = await waitForElement(`#psgn-nationality${index}`);
        if (nationalityDropdown) {
          nationalityDropdown.click();
          await new Promise(r => setTimeout(r, 300));
          
          const nationalityValue = passenger.nationality || 'IN';
          const nationalityOption = document.querySelector(`li[aria-label="${nationalityValue}"]`);
          if (nationalityOption) {
            nationalityOption.click();
            await new Promise(r => setTimeout(r, 300));
          }
        }

      } catch (error) {
        console.error(`Error filling details for passenger ${index}:`, error);
      }
    }

    // Fill contact details
    if (user_data.contact_details) {
      try {
        if (user_data.contact_details.mobileNumber) {
          const mobileField = await waitForElement('input[placeholder="Mobile No."]');
          mobileField.value = user_data.contact_details.mobileNumber;
          mobileField.dispatchEvent(new Event('input', { bubbles: true }));
          mobileField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (user_data.contact_details.email) {
          const emailField = await waitForElement('input[placeholder="Email"]');
          emailField.value = user_data.contact_details.email;
          emailField.dispatchEvent(new Event('input', { bubbles: true }));
          emailField.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } catch (error) {
        console.error('Error filling contact details:', error);
      }
    }

    // Handle preferences
    try {
      const autoUpgradeCheckbox = await waitForElement('input[formcontrolname="autoUpgradation"]');
      if (user_data.other_preferences?.autoUpgradation !== autoUpgradeCheckbox.checked) {
        autoUpgradeCheckbox.click();
      }

      const confirmBerthsCheckbox = await waitForElement('input[formcontrolname="confirmBerths"]');
      if (user_data.other_preferences?.confirmberths !== confirmBerthsCheckbox.checked) {
        confirmBerthsCheckbox.click();
      }
    } catch (error) {
      console.error('Error handling preferences:', error);
    }

    statusUpdate("passenger_details_filled");

  } catch (error) {
    console.error('Error in fillPassengerDetails:', error);
    statusUpdate("passenger_details_failed");
  }
}

// Helper function to check if an element exists and is visible
function isElementVisible(element) {
  return element && 
         element.offsetParent !== null && 
         window.getComputedStyle(element).display !== 'none' &&
         window.getComputedStyle(element).visibility !== 'hidden';
}

function continueScript() {
  statusUpdate("continue_script");
  const loginBtn = document.querySelector(
    "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > a.search_btn.loginText.ng-star-inserted"
  );
  // fill data in respective form at different pages
  if (window.location.href.includes("train-search")) {
    if (loginBtn.innerText.trim().toUpperCase() === "LOGOUT") {
      loadJourneyDetails();
    }
    if (loginBtn.innerText.trim().toUpperCase() === "LOGIN") {
      loginBtn.click();
      loadLoginDetails();
    }
  } else if (window.location.href.includes("nget/booking/train-list")) {
    console.log("nget/booking/train-list");
  } else {
    console.log("No script ahead");
  }
}

window.onload = function (e) {
  // wait for time
  // const timerDiv =
  //   document.querySelector(
  //     "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 > span > strong"
  //   ) ??
  //   document.querySelector(
  //     "#slide-menu > p-sidebar > div > nav > div > label"
  //   );
  const loginBtn = document.querySelector(
    "body > app-root > app-home > div.header-fix > app-header > div.col-sm-12.h_container > div.text-center.h_main_div > div.row.col-sm-12.h_head1 "
  );
  const config = { attributes: false, childList: true, subtree: false };
  const loginDetectorCallback = (mutationList, observer) => {
    if (
      mutationList.filter(
        (m) =>
          m.type === "childList" &&
          m.addedNodes.length > 0 &&
          [...m.addedNodes].filter(
            (n) => n?.innerText?.trim()?.toUpperCase() === "LOGOUT"
          ).length > 0
      ).length > 0
    ) {
      observer.disconnect();
      loadJourneyDetails();
    } else {
      loginBtn.click();
      loadLoginDetails();
    }
  };
  const observer = new MutationObserver(loginDetectorCallback);
  observer.observe(loginBtn, config);

  console.log("content script attached");
  chrome.storage.local.get(null, (result) => {
    user_data = result;
    continueScript();
  });
};
