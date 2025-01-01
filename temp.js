// To select p-autocomplete
let ele = document.querySelector("#destination"); // select p-autocomplete element
ele.eventListeners()[2](); // opens up the popup
ele.forEach((l) => {
  if (l.innerText === "AKOLA JN - AK") {
    l.click();
  }
}); // will cylick the particular list item from popup if matching station name is found. This will select the station

document.querySelectorAll("#origin ul")[0].innerHTML;
document.querySelectorAll("#origin ul")[0].innerHTML =
  document.querySelectorAll("#origin ul li")[1].innerHTML +
  document.querySelectorAll("#origin ul")[0].innerHTML;

//For dropdowns
document.querySelector("#journeyQuota div[role=button]").click();
document.querySelectorAll("#journeyQuota ul li")[4].click();

document.querySelector("#jDate > span > input").value = "17/01/2023"; //  for setting date
document.querySelector("#concessionBooking").checked = false; //  for checkbox
document.querySelector("#dateSpecific").checked = false; //  for checkbox
document.querySelector("#availableBerth").checked = false; //  for checkbox
document.querySelector("#passBooking").checked = false; //  for checkbox
