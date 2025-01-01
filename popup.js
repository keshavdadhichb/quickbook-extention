let finalData = {
  irctc_credentials: {},
  journey_details: {},
  extension_data: {
    book_at_tatkal_time: true,
  },
  passenger_details: [],
  infant_details: [],
  contact_details: {},
  gst_details: {},
  payment_preferences: {},
  travel_preferences: {},
  other_preferences: {},
};

const defaultValue = {
  gender: "M",
  nationality: "IN",
};

const errors = [];
let port;

function filterStations(searchText) {
  if (!searchText) return [];
  searchText = searchText.toLowerCase();
  return stationList.filter(station => 
    station.english_label.toLowerCase().includes(searchText) ||
    station.value.toLowerCase().includes(searchText)
  ).slice(0, 10); // Limit to 10 results for performance
}

function showDropdownList(listId, items, clickHandler) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  list.style.display = items.length ? 'block' : 'none';
  
  items.forEach(station => {
    const li = document.createElement('li');
    li.className = 'dropdown-list-item';
    li.dataset.englishLabel = station.english_label;
    li.dataset.hindiLabel = station.hindi_label;
    li.dataset.stationCode = station.value;
    li.textContent = `${station.english_label} - ${station.value}`;
    li.addEventListener('click', (e) => {
      clickHandler(e);
      list.style.display = 'none';
    });
    list.appendChild(li);
  });
}

window.addEventListener("load", () => {
  addDropdownOption(
    "from-station-input",
    "from-station-list",
    setFromStation,
    stationList,
    (q) => {
      return `<li data-english-label="${q.english_label}" data-hindi-label="${q.hindi_label}" data-station-code="${q.value}"  class="dropdown-list-item">${q.english_label} - ${q.value}</li>`;
    }
  );

  addDropdownOption(
    "destination-station-input",
    "destination-station-list",
    setDestinationStation,
    stationList,
    (q) => {
      return `<li data-english-label="${q.english_label}" data-hindi-label="${q.hindi_label}" data-station-code="${q.value}" class="dropdown-list-item">${q.english_label} - ${q.value}</li>`;
    }
  );

  addDropdownOption(
    "journey-class-input",
    "journey-class-list",
    setJourneyClass,
    classList,
    (q) => {
      return `<li class="dropdown-list-item" data-label="${q.label}" data-class="${q.value}">${q.label}</li>`;
    }
  );

  addDropdownOption("quota-input", "quota-list", setQuota, quotaList, (q) => {
    return `<li class="dropdown-list-item" data-label="${q.label}" data-quota="${q.value}">${q.label}</li>`;
  });

  addSelectOption("passenger-gender-1", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });
  addSelectOption("passenger-gender-2", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });
  addSelectOption("passenger-gender-3", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });
  addSelectOption("passenger-gender-4", passengerGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });

  addSelectOption("passenger-nationality-1", countryList, (q, i) => {
    return `<option class="dropdown-list-item" selected=${
      q.countryCode === "IN"
    } value="${q.countryCode}" data-label="${
      q.country
    }" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });
  addSelectOption("passenger-nationality-2", countryList, (q, i) => {
    if (q.countryCode === "IN") tempIndex = i;
    return `<option class="dropdown-list-item" value="${q.countryCode}" data-label="${q.country}" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });
  addSelectOption("passenger-nationality-3", countryList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.countryCode}" data-label="${q.country}" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });
  addSelectOption("passenger-nationality-4", countryList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.countryCode}" data-label="${q.country}" data-index="${i}" data-nationality="${q.countryCode}">${q.country}</li>`;
  });

  addSelectOption("reservationChoice", reservationChoiceList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}">${q.label}</li>`;
  });

  let indiaIndex = countryList.findIndex((c) => c.countryCode === "IN");
  document.querySelector("#passenger-nationality-1").selectedIndex = indiaIndex;
  document.querySelector("#passenger-nationality-2").selectedIndex = indiaIndex;
  document.querySelector("#passenger-nationality-3").selectedIndex = indiaIndex;
  document.querySelector("#passenger-nationality-4").selectedIndex = indiaIndex;
  document.querySelector("#book_at_tatkal_time").checked = true;

  addSelectOption("infant-gender-1", infantGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
  });
  addSelectOption("infant-gender-2", infantGenderList, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
  });
  addSelectOption("infant-age-1", infantAge, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-age="${q.value}"><span>${q.label}</span></li>`;
  });
  addSelectOption("infant-age-2", infantAge, (q, i) => {
    return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-age="${q.value}"><span>${q.label}</span></li>`;
  });

  document
    .querySelector("#irctc-login")
    .addEventListener("change", setIRCTCUsername);
  document
    .querySelector("#irctc-password")
    .addEventListener("change", setIRCTCPassword);
  document
    .querySelector("#book_at_tatkal_time")
    .addEventListener("change", setFeatureDetails);
  document
    .querySelector("#from-station-input")
    .addEventListener("keyup", fromStationFilter);
  document
    .querySelector("#destination-station-input")
    .addEventListener("keyup", destinationStationFilter);
  document
    .querySelector("#journey-date")
    .addEventListener("keyup", journeyDateChanged);
  document
    .querySelector("#journey-class-input")
    .addEventListener("keyup", journeyClassFilter);
  document
    .querySelector("#quota-input")
    .addEventListener("keyup", journeyQuotaFilter);
  document
    .querySelector("#train-no")
    .addEventListener("change", setTrainNumber);
  for (let i = 0; i < 4; i++) {
    document
      .querySelector("#passenger-name-1")
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector("#age-1")
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector("#passenger-gender-1")
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector("#passenger-berth-1")
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
    document
      .querySelector("#passenger-nationality-1")
      .addEventListener("change", (e) =>
        setPassengerDetails(e, i, "passenger")
      );
  }
  for (let i = 0; i < 2; i++) {
    document
      .querySelector("#infant-name-1")
      .addEventListener("change", (e) => setPassengerDetails(e, i, "infant"));
    document
      .querySelector("#age-1")
      .addEventListener("change", (e) => setPassengerDetails(e, i, "infant"));
    document
      .querySelector("#infant-gender-1")
      .addEventListener("change", (e) => setPassengerDetails(e, i, "infant"));
  }

  document
    .querySelector("#gstin-number")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-name")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-flat")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-street")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-area")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-PIN")
    .addEventListener("change", setGSTINDetails);
  document
    .querySelector("#gstin-City")
    .addEventListener("change", setGSTINDetails);

  document
    .querySelector("#mobileNumber")
    .addEventListener("change", setContactDetails);
  document
    .querySelector("#email")
    .addEventListener("change", setContactDetails);

  document
    .querySelector("#autoUpgradation")
    .addEventListener("change", setOtherPreferences);
  document
    .querySelector("#confirmberths")
    .addEventListener("change", setOtherPreferences);
  document
    .querySelector("#reservationChoice")
    .addEventListener("change", setOtherPreferences);
  document
    .querySelector("#coachId")
    .addEventListener("change", setOtherPreferences);

  document
    .querySelector("#travelInsuranceOpted-1")
    .addEventListener("change", setTravelPreferences);
  document
    .querySelector("#travelInsuranceOpted-2")
    .addEventListener("change", setTravelPreferences);

  document
    .querySelector("#paymentType-1")
    .addEventListener("change", setPaymentPreferences);
  document
    .querySelector("#paymentType-2")
    .addEventListener("change", setPaymentPreferences);

  document.querySelector("#submit-btn").addEventListener("click", saveForm);
  document
    .querySelector("#load-btn-1")
    .addEventListener("click", () => loadUserData());
  document
    .querySelector("#clear-btn")
    .addEventListener("click", () => clearData());
  document
    .querySelector("#connect-btn")
    .addEventListener("click", connectWithBg);
});

//
// Filter functions for all dropdown
//
function fromStationFilter(event) {
  const searchText = event.target.value;
  const filteredStations = filterStations(searchText);
  showDropdownList('from-station-list', filteredStations, setFromStation);
}

function destinationStationFilter(event) {
  const searchText = event.target.value;
  const filteredStations = filterStations(searchText);
  showDropdownList('destination-station-list', filteredStations, setDestinationStation);
}

function journeyClassFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("journey-class-input");
  filter = input.value.toUpperCase();
  ul = document.getElementById("journey-class-list");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("span")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function journeyQuotaFilter() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("quota-input");
  filter = input.value.toUpperCase();
  ul = document.getElementById("quota-list");
  li = ul.getElementsByTagName("li");

  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("span")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//
// Add options to all dropdowns
//
function addDropdownOption(
  inputId,
  optionListId,
  optionOnClick,
  options,
  renderOption
) {
  let dropdown;
  dropdown = document.querySelector(`#${inputId}`).parentElement;
  dropdown.querySelector(`#${optionListId}`).innerHTML = options
    .map(renderOption)
    .join("");
  [...(dropdown.querySelectorAll(`#${optionListId} li`) ?? [])].forEach((e) =>
    e.addEventListener("click", optionOnClick)
  );
}

function addSelectOption(selectId, options, renderOption) {
  let select;
  select = document.querySelector(`#${selectId}`);
  select.innerHTML = options.map(renderOption).join("");
}

function setBerthOptions(selectedClass) {
  addSelectOption(
    "passenger-berth-1",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
  addSelectOption(
    "passenger-berth-2",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
  addSelectOption(
    "passenger-berth-3",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
  addSelectOption(
    "passenger-berth-4",
    berthChoiceList[selectedClass],
    (q, i) => {
      return `<option class="dropdown-list-item" value="${q.value}" data-label="${q.label}" data-index="${i}" data-gender="${q.value}"><span>${q.label}</span></li>`;
    }
  );
}

//
// Update Final Data
//

function setIRCTCUsername(e) {
  if (!finalData["irctc_credentials"]) finalData["irctc_credentials"] = {};
  finalData["irctc_credentials"]["user_name"] = e.target.value;
  console.log("data-update", finalData);
}

function setIRCTCPassword(e) {
  finalData["irctc_credentials"]["password"] = e.target.value;
  console.log("data-update", finalData);
}

function setFromStation(event) {
  const station = {
    hindi_label: event.target.dataset.hindiLabel,
    english_label: event.target.dataset.englishLabel,
    station_code: event.target.dataset.stationCode
  };
  
  finalData.journey_details.from = station;
  document.getElementById('from-station-input').value = 
    `${station.english_label} - ${station.station_code}`;
}

function setDestinationStation(event) {
  const station = {
    hindi_label: event.target.dataset.hindiLabel,
    english_label: event.target.dataset.englishLabel,
    station_code: event.target.dataset.stationCode
  };
  
  finalData.journey_details.destination = station;
  document.getElementById('destination-station-input').value = 
    `${station.english_label} - ${station.station_code}`;
}

function setJourneyClass(e) {
  finalData["journey_details"]["class"] = {
    label: e.target.dataset["label"],
    value: e.target.dataset["class"],
  };
  document.querySelector(
    "#journey-class-input"
  ).value = `${e.target.dataset["label"]}`;
  setBerthOptions(e.target.dataset["class"]);
}

function setQuota(e) {
  finalData["journey_details"]["quota"] = {
    label: e.target.dataset["label"],
    value: e.target.dataset["quota"],
  };
  document.querySelector("#quota-input").value = `${e.target.dataset["label"]}`;
}

function journeyDateChanged(e) {
  finalData["journey_details"]["date"] = e.target.value;
}

function setTrainNumber(e) {
  finalData["journey_details"]["train-no"] = e.target.value;
}

function setPassengerDetails(e, index, type) {
  if (type === "infant") {
    if (!finalData["infant_details"][index])
      finalData["infant_details"][index] = {};
    finalData["infant_details"][index][e.target.name] = e.target.value;
  } else {
    if (!finalData["passenger_details"][index])
      finalData["passenger_details"][index] = {};
    finalData["passenger_details"][index][e.target.name] = e.target.value;
  }
}

function setContactDetails(e) {
  if (!finalData["contact_details"]) finalData["contact_details"] = {};
  finalData["contact_details"][e.target.name] = e.target.value;
}

function setGSTINDetails(e) {
  if (!finalData["gst_details"]) finalData["gst_details"] = {};
  finalData["gst_details"][e.target.name] = e.target.value;
}

function setOtherPreferences(e) {
  if (!finalData["other_preferences"]) finalData["other_preferences"] = {};
  finalData["other_preferences"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}

function setPaymentPreferences(e) {
  if (!finalData["payment_preferences"]) finalData["payment_preferences"] = {};
  finalData["payment_preferences"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}

function setTravelPreferences(e) {
  if (!finalData["travel_preferences"]) finalData["travel_preferences"] = {};
  finalData["travel_preferences"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}

function setFeatureDetails(e) {
  if (!finalData["extension_data"]) finalData["extension_data"] = {};
  finalData["extension_data"][e.target.name] =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
}

// function setData(i) {
//   const temp_data = i == 1 ? user_data : user_data_with_gst;
//   finalData["irctc_credentials"] = temp_data["irctc_credentials"] ?? {};
//   finalData["journey_details"] = temp_data["journey_details"] ?? {};
//   finalData["passenger_details"] = temp_data["passenger_details"] ?? [];
//   finalData["infant_details"] = temp_data["infant_details"] ?? [];
//   finalData["contact_details"] = temp_data["contact_details"] ?? {};
//   finalData["gst_details"] = temp_data["gst_details"] ?? {};
//   finalData["payment_preferences"] = temp_data["payment_preferences"] ?? {};
//   finalData["travel_preferences"] = temp_data["travel_preferences"] ?? {};
//   finalData["other_preferences"] = temp_data["other_preferences"] ?? {};
// }

function modifyUserData() {
  // Ensure all required fields are present
  if (!finalData.journey_details) {
    finalData.journey_details = {};
  }
  
  // Add basic validation
  if (!finalData.irctc_credentials?.user_name || !finalData.irctc_credentials?.password) {
    console.error('IRCTC credentials are required');
    return;
  }

  if (!finalData.journey_details?.from || !finalData.journey_details?.destination) {
    console.error('Journey stations are required');
    return;
  }

  // Clean up passenger data
  finalData.passenger_details = finalData.passenger_details.filter(p => 
    p.name && p.age && p.name.trim() !== '' && p.age.trim() !== ''
  );

  console.log('Modified user data:', finalData);
}

function loadUserData() {
  chrome.storage.local.get(null, (result) => {
    if (result && Object.keys(result).length > 0) {
      finalData = result;
      
      // Fill IRCTC credentials
      document.getElementById('irctc-login').value = result.irctc_credentials?.user_name || '';
      document.getElementById('irctc-password').value = result.irctc_credentials?.password || '';
      
      // Fill journey details
      if (result.journey_details?.from) {
        document.getElementById('from-station-input').value = 
          `${result.journey_details.from.english_label} - ${result.journey_details.from.station_code}`;
      }
      if (result.journey_details?.destination) {
        document.getElementById('destination-station-input').value = 
          `${result.journey_details.destination.english_label} - ${result.journey_details.destination.station_code}`;
      }
      document.getElementById('journey-date').value = result.journey_details?.date || '';
      document.getElementById('train-no').value = result.journey_details?.train_no || '';
      
      // Fill passenger details
      result.passenger_details?.forEach((passenger, index) => {
        const i = index + 1;
        if (i <= 4) {
          document.getElementById(`passenger-name-${i}`).value = passenger.name || '';
          document.getElementById(`age-${i}`).value = passenger.age || '';
          document.getElementById(`passenger-gender-${i}`).value = passenger.gender || 'M';
          document.getElementById(`passenger-berth-${i}`).value = passenger.berth || '';
          document.getElementById(`passenger-nationality-${i}`).value = passenger.nationality || 'IN';
        }
      });
      
      // Fill contact details
      document.getElementById('mobileNumber').value = result.contact_details?.mobileNumber || '';
      document.getElementById('email').value = result.contact_details?.email || '';
      
      console.log('Data loaded successfully');
      alert('Data loaded successfully!');
    } else {
      console.log('No saved data found');
      alert('No saved data found');
    }
  });
}

function getMsg(msg_type, msg_body) {
  return {
    msg: {
      type: msg_type,
      data: msg_body,
    },
    sender: "popup",
    id: "irctc",
  };
}

function collectIRCTCCredentials() {
  const username = document.getElementById('irctc-login').value.trim();
  const password = document.getElementById('irctc-password').value.trim();
  
  if (username || password) {
    finalData.irctc_credentials = {
      ...(username && { user_name: username }),
      ...(password && { password: password })
    };
  }
}

function collectJourneyDetails() {
  const date = document.getElementById('journey-date').value.trim();
  const trainNo = document.getElementById('train-no').value.trim();
  
  finalData.journey_details = {
    ...finalData.journey_details, // Preserve existing station data if any
    ...(date && { date }),
    ...(trainNo && { train_no: trainNo })
  };
}

function collectPassengerDetails() {
  finalData.passenger_details = [];
  
  for (let i = 1; i <= 4; i++) {
    const name = document.getElementById(`passenger-name-${i}`).value.trim();
    const age = document.getElementById(`age-${i}`).value.trim();
    const gender = document.getElementById(`passenger-gender-${i}`).value;
    const berth = document.getElementById(`passenger-berth-${i}`).value;
    const nationality = document.getElementById(`passenger-nationality-${i}`).value;
    
    // Only add passenger if at least name or age is provided
    if (name || age) {
      finalData.passenger_details.push({
        ...(name && { name }),
        ...(age && { age }),
        ...(gender && { gender }),
        ...(berth && { berth }),
        ...(nationality && { nationality })
      });
    }
  }
}

function collectContactDetails() {
  const mobile = document.getElementById('mobileNumber').value.trim();
  const email = document.getElementById('email').value.trim();
  
  if (mobile || email) {
    finalData.contact_details = {
      ...(mobile && { mobileNumber: mobile }),
      ...(email && { email })
    };
  }
}

function saveForm() {
  try {
    collectIRCTCCredentials();
    collectJourneyDetails();
    collectPassengerDetails();
    collectContactDetails();
    
    // Remove empty objects from finalData
    Object.keys(finalData).forEach(key => {
      if (Object.keys(finalData[key]).length === 0) {
        delete finalData[key];
      }
    });
    
    chrome.storage.local.set(finalData).then(() => {
      console.log('Form data saved:', finalData);
      alert('Data saved successfully!');
    }).catch(error => {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    });
  } catch (error) {
    console.error('Error in saveForm:', error);
    alert('Error preparing data. Please check your inputs.');
  }
}

function clearData() {
  chrome.storage.local.clear();
}

function connectWithBg() {
  saveForm(); // Make sure data is saved before starting
  chrome.runtime.sendMessage(
    getMsg("activate_script", finalData),
    (response) => {
      console.log('Script activation response:', response);
    }
  );
}

// Add event listeners for the buttons
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('submit-btn').addEventListener('click', saveForm);
  document.getElementById('connect-btn').addEventListener('click', connectWithBg);
  document.getElementById('load-btn-1').addEventListener('click', loadUserData);
  document.getElementById('clear-btn').addEventListener('click', clearData);
});

// EA, FC, VC, VS  - no berth preference available
