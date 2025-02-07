// Event listener 
// Code inside this block will run when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {

    //initial fetch
    fetchData();
    // Timer set to fetch data every 60 minutes
    setInterval(fetchData, 60 * 60 * 1000); // Every 60 minutes

    // Access the modal element
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const closeModal = document.getElementsByClassName("close")[0];

    // Events for opening and closing the modal
    openModalBtn.addEventListener('click', () => modal.style.display = "block");
    closeModal.addEventListener('click', () => modal.style.display = "none");

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Access the search input and attach event listener for filtering
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filterTable(searchTerm);
    });

    // Button to reset the table view
    const resetViewBtn = document.getElementById('resetViewBtn');
    resetViewBtn.addEventListener('click', function () {
        resetTableView(); // Reset the table to its initial state
        resetSortArrows(); // Reset the sorting arrows
    });

    // Image selection operations
    const imageUploadBtn = document.getElementById('imageUploadBtn');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');

    // Open file selection when the upload button is clicked
    imageUploadBtn.addEventListener('click', function () {
        imageInput.click();
    });

    // Show image preview when a file is selected
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result; // Set the image source
                imagePreview.style.display = 'block'; // Make the image visible
            };
            reader.readAsDataURL(file); // Convert the file to data URL
        }
    });
});

// Asynchronous function for fetching data
async function fetchData() {
    console.log("Data fetch request made:", new Date());
    try {
        const response = await fetch('fetch_api.php'); // Fetch data from the API
        const data = await response.json();
        if (Array.isArray(data)) {
            populateTable(data); // Add the fetched data to the table
        } else {
            console.error("Data is invalid or not in the expected format.");
        }
    } catch (error) {
        console.error("Data fetch error:", error);
    }
}

let originalData = []; // Array to store original table data

// Function to populate the table contents
function populateTable(tasks) {
    originalData = tasks;
    filteredData = tasks;
    const tableBody = document.querySelector('#taskTable tbody');
    tableBody.innerHTML = ''; // Clear previous rows

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.task}</td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td style="background-color: ${task.colorCode};">${task.colorCode}</td>
        `;
        tableBody.appendChild(row); 
    });
    resetSortArrows(); // Reset sorting
}

// Function to filter the table based on the search term
function filterTable(searchTerm) {
    const rows = document.querySelectorAll('#taskTable tbody tr');
    rows.forEach(row => {
        const rowText = Array.from(row.cells).map(cell => cell.textContent.toLowerCase()).join(' ');
        row.style.display = rowText.includes(searchTerm) ? '' : 'none'; // Show if matched
    });
}

// Function to reset the table to its unsorted original state
function resetTableView() {
    populateTable(originalData); // Restore the original data
    document.getElementById('searchInput').value = ''; // Clear the search input
}

let sortDirection = 'asc'; // Default sorting direction

// Add event listeners to sortable table headers
document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', function () {
        const columnIndex = Array.from(th.parentElement.children).indexOf(th);
        sortTable(columnIndex, sortDirection);
        sortDirection = (sortDirection === 'asc') ? 'desc' : 'asc';
        updateSortArrow(th, sortDirection); // Update the sorting arrows
    });
});

// Function to sort the table by the selected column
function sortTable(columnIndex, direction) {
    const rows = Array.from(document.querySelector('#taskTable tbody').rows);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();

        return direction === 'asc' 
            ? cellA.localeCompare(cellB) 
            : cellB.localeCompare(cellA);
    });

    rows.forEach(row => document.querySelector('#taskTable tbody').appendChild(row));
}

// Function to update the sort arrow
function updateSortArrow(th, direction) {
    resetSortArrows();

    let sortIcon = th.querySelector('.sort-icon');
    if (!sortIcon) {
        sortIcon = document.createElement('span');
        sortIcon.classList.add('sort-icon');
        th.appendChild(sortIcon);
    }
    
    sortIcon.style.visibility = 'visible';
    sortIcon.textContent = direction === 'asc' ? '↑' : '↓';
}

// Function to reset all sorting arrows
function resetSortArrows() {
    document.querySelectorAll('.sort-icon').forEach(arrow => {
        arrow.textContent = ''; 
        arrow.style.visibility = 'hidden';

    });
}
