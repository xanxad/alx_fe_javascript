document.addEventListener("DOMContentLoaded", () => {
  // Retrieve quotes and selected category from local storage or use defaults
  const storedQuotes = localStorage.getItem("quotes");
  const quotes = storedQuotes
    ? JSON.parse(storedQuotes)
    : [
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

  const storedCategory = localStorage.getItem("selectedCategory");
  const selectedCategory = storedCategory || "all";

  // Select the DOM elements by their IDs
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const formContainer = document.getElementById("formContainer");
  const importFileInput = document.getElementById("importFile");
  const exportQuotesBtn = document.getElementById("exportQuotes");
  const categoryFilter = document.getElementById("categoryFilter");

  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Function to save the selected category to local storage
  function saveSelectedCategory(category) {
    localStorage.setItem("selectedCategory", category);
  }

  // Function to display a random quote
  function showRandomQuote() {
    const filteredQuotes = quotes.filter(
      (quote) =>
        selectedCategory === "all" || quote.category === selectedCategory
    );
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    // Update the quote display using innerHTML
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }

  // Function to create and display the form for adding new quotes
  function createAddQuoteForm() {
    // Create input for new quote text
    const newQuoteTextInput = document.createElement("input");
    newQuoteTextInput.id = "newQuoteText";
    newQuoteTextInput.type = "text";
    newQuoteTextInput.placeholder = "Enter a new quote";

    // Create input for new quote category
    const newQuoteCategoryInput = document.createElement("input");
    newQuoteCategoryInput.id = "newQuoteCategory";
    newQuoteCategoryInput.type = "text";
    newQuoteCategoryInput.placeholder = "Enter quote category";

    // Create button for adding new quote
    const addQuoteBtn = document.createElement("button");
    addQuoteBtn.id = "addQuoteBtn";
    addQuoteBtn.textContent = "Add Quote";

    // Append the created elements to formContainer
    formContainer.appendChild(newQuoteTextInput);
    formContainer.appendChild(newQuoteCategoryInput);
    formContainer.appendChild(addQuoteBtn);

    // Function to add a new quote
    function addQuote() {
      const quoteText = newQuoteTextInput.value.trim();
      const quoteCategory = newQuoteCategoryInput.value.trim();

      if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories(); // Update the filter options with the new category

        // Clear the input fields
        newQuoteTextInput.value = "";
        newQuoteCategoryInput.value = "";

        alert("New quote added successfully!");
      } else {
        alert("Please enter both quote text and category.");
      }
    }

    // Event listener for adding a new quote
    addQuoteBtn.addEventListener("click", addQuote);
  }

  // Function to update the category filter options
  function populateCategories() {
    const categories = [
      "all",
      ...new Set(quotes.map((quote) => quote.category)),
    ];
    categoryFilter.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
    categoryFilter.value = selectedCategory;
  }

  // Function to filter quotes based on the selected category
  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    saveSelectedCategory(selectedCategory);
    showRandomQuote();
  }

  // Function to export quotes to a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
      showRandomQuote(); // Optionally refresh the display
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Event listener for showing a random quote
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Event listener for export quotes button
  exportQuotesBtn.addEventListener("click", exportToJsonFile);

  // Create and display the add quote form on page load
  createAddQuoteForm();

  // Show an initial quote
  showRandomQuote();

  // Event listener for import file input
  importFileInput.addEventListener("change", importFromJsonFile);

  // Populate the category filter and set the selected value
  populateCategories();
  categoryFilter.value = selectedCategory;

  // Filter quotes on category change
  categoryFilter.addEventListener("change", filterQuotes);
});
