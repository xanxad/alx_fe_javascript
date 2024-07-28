document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Simulated API endpoint

  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    {
      text: "The only limit to our realization of tomorrow is our doubts of today.",
      category: "Motivation",
    },
    {
      text: "Life is 10% what happens to us and 90% how we react to it.",
      category: "Life",
    },
    {
      text: "Do not watch the clock. Do what it does. Keep going.",
      category: "Time",
    },
  ];

  let selectedCategory = localStorage.getItem("selectedCategory") || "all";

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const formContainer = document.getElementById("formContainer");
  const categoryFilter = document.getElementById("categoryFilter");
  const exportQuotesBtn = document.getElementById("exportQuotes");
  const importFileInput = document.getElementById("importFile");

  // Function to display a random quote
  function showRandomQuote() {
    const filteredQuotes = quotes.filter(
      (quote) =>
        selectedCategory === "all" || quote.category === selectedCategory
    );
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }

  // Function to create and display the form for adding new quotes
  function createAddQuoteForm() {
    formContainer.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuoteBtn">Add Quote</button>
    `;

    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    // Function to add a new quote
    addQuoteBtn.addEventListener("click", async () => {
      const quoteText = newQuoteText.value.trim();
      const quoteCategory = newQuoteCategory.value.trim();

      if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };

        // Save the new quote locally
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        // Send the new quote to the server
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: quoteCategory, body: quoteText }),
          });

          if (response.ok) {
            alert("New quote added successfully!");
          } else {
            alert("Failed to add the quote to the server.");
          }
        } catch (error) {
          console.error("Error adding quote to server:", error);
          alert("Failed to add the quote to the server.");
        }
      } else {
        alert("Please enter both quote text and category.");
      }
    });
  }

  // Function to populate the category filter dropdown
  function populateCategories() {
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    categoryFilter.value = selectedCategory;
  }

  // Function to filter quotes based on selected category
  function filterQuotes() {
    selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);
    showRandomQuote();
  }

  // Function to export quotes to a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
  }

  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = quotes.concat(importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        alert("Quotes imported successfully!");
      } catch (error) {
        alert("Failed to import quotes. Please check the file format.");
      }
    };
    reader.readAsText(file);
  }

  // Function to fetch quotes from the server
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(apiUrl);
      const serverQuotes = await response.json();

      // Convert server quotes to match the local quote structure
      const formattedQuotes = serverQuotes.map((sq) => ({
        text: sq.body,
        category: sq.title,
      }));

      return formattedQuotes;
    } catch (error) {
      console.error("Failed to fetch quotes from server:", error);
      return [];
    }
  }

  // Function to sync quotes with the server and update local storage
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    // Example conflict resolution: server's data takes precedence
    const uniqueServerQuotes = serverQuotes.filter(
      (serverQuote) =>
        !quotes.some((localQuote) => localQuote.text === serverQuote.text)
    );
    quotes = [...uniqueServerQuotes, ...quotes];
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    alert("Quotes synced with server!");
  }

  // Initial setup
  newQuoteBtn.addEventListener("click", showRandomQuote);
  exportQuotesBtn.addEventListener("click", exportToJsonFile);
  importFileInput.addEventListener("change", importFromJsonFile);
  categoryFilter.addEventListener("change", filterQuotes);

  createAddQuoteForm();
  populateCategories();
  showRandomQuote();

  // Periodically sync with the server (e.g., every minute)
  setInterval(syncQuotes, 60000);

  // Sync with the server on page load
  syncQuotes();
});
