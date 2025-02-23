document.addEventListener("DOMContentLoaded", function() {
    // Initialize datepicker with options
    function initializeDatepicker() {
        var datepickerElems = document.querySelectorAll('.datepicker');
        var options = {
            format: 'yyyy-mm-dd',
            autoClose: true,
            yearRange: 10,
            container: 'body',
            onOpen: function() {
                setTimeout(() => {
                    let datepickerModal = document.querySelector('.datepicker-modal');
                    if (datepickerModal) {
                        datepickerModal.style.position = "fixed";
                        datepickerModal.style.top = "50%";
                        datepickerModal.style.left = "50%";
                        datepickerModal.style.transform = "translate(-50%, -50%)";
                        datepickerModal.style.width = "400px"; 
                    }
                }, 10);
            }
        };
        M.Datepicker.init(datepickerElems, options);
    }

    // Call the datepicker initialization function
    initializeDatepicker();

    // Get today's date in yyyy-mm-dd format
    function getTodayDate() {
        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0'); 
        let day = String(today.getDate()).padStart(2, '0'); 
        return `${year}-${month}-${day}`;
    }

    // Get the date one week before today in yyyy-mm-dd format
    function getOneWeekAgoDate() {
        let today = new Date();
        today.setDate(today.getDate() - 7); // Subtract 7 days
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0'); 
        let day = String(today.getDate()).padStart(2, '0'); 
        return `${year}-${month}-${day}`;
    }

    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    // Set initial value: start date to one week ago and end date to today
    startDateInput.value = getOneWeekAgoDate();
    endDateInput.value = getTodayDate();

    // Clear text on focus
    function clearOnFocus(input) {
        input.addEventListener("focus", function() {
            input.value = "";
        });
    }

    // Restore today's date if left empty
    function restoreIfEmpty(input) {
        input.addEventListener("blur", function() {
            if (!input.value) {
                input.value = getTodayDate();
            }
        });
    }

    clearOnFocus(startDateInput);
    clearOnFocus(endDateInput);
    restoreIfEmpty(startDateInput);
    restoreIfEmpty(endDateInput);
});

// Slider for magnitude
const magnitudeSlider = document.getElementById('test5');

// Add an event listener for input changes on the slider
magnitudeSlider.addEventListener('input', function() {
    const selectedMagnitude = this.value; 
    console.log(`Selected Magnitude: ${selectedMagnitude}`); 
    state.magnitude = Number(selectedMagnitude);
});

// Add listeners to the date pickers
document.getElementById('start-date').addEventListener('change', function() {
    state.startDate = this.value; 
});

document.getElementById('end-date').addEventListener('change', function() {
    state.endDate = this.value; 
});

// Add a listener to the submit button
document.querySelector('.submit-button').addEventListener('click', function(event) {
    event.preventDefault();

    // Get start and end date values
    const startDate = document.getElementById('start-date').value || getTodayDate();
    const endDate = document.getElementById('end-date').value || getTodayDate();

    // Validate the selected dates
    if (!validateDates(startDate, endDate)) {
        return; 
    }

    // If dates are valid, update the state and fetch data
    state.startDate = startDate;
    state.endDate = endDate;

    fetchEarthquakeData();
});

// Initialize sidenav
var sidenavElem = document.querySelector("#slide-out");
var sidenavInstance = M.Sidenav.init(sidenavElem);
sidenavInstance.open();

// Sidenav trigger
var menuButton = document.querySelector(".nav-trigger");
menuButton.addEventListener("click", function(event) {
    event.preventDefault(); 
    sidenavInstance.isOpen ? sidenavInstance.close() : sidenavInstance.open();
});

// Validate dates and show error modal if invalid
function validateDates(startDate, endDate) {
    const today = new Date();
    const selectedStartDate = new Date(startDate);
    const selectedEndDate = new Date(endDate);

    // Check if end date is in the past
    if (selectedEndDate > today) {
        showErrorModal("The end date cannot be in the future.");
        return false;
    }

    // Check if start date is after end date
    if (selectedStartDate > selectedEndDate) {
        showErrorModal("The start date cannot be after the end date.");
        return false;
    }

    return true;
}

// Show error modal with a specific message
function showErrorModal(message) {
    document.getElementById("error-message").textContent = message;
    const errorModal = document.getElementById("error-modal");
    const modalInstance = M.Modal.init(errorModal); 
    modalInstance.open(); 
}

// Initialize error modal 
document.addEventListener("DOMContentLoaded", function() {
    const errorModal = document.getElementById("error-modal");
    M.Modal.init(errorModal); // Initialize the modal
});

// Pop up magnitude number indicator
document.addEventListener("DOMContentLoaded", function() {
    var sliders = document.querySelectorAll('.range-field input[type="range"]');
    M.Range.init(sliders);
});
