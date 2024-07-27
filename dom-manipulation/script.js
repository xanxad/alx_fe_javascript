document.addEventListener("DOMContentLoaded", () => {
  // Initial array of quote objects
  const quotes = [
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

  // Select the DOM elements by their IDs
  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteBtn = document.getElementById("newQuote");
  const formContainer = document.getElementById("formContainer"); // Container for the form
  const importFileInput = document.getElementById("importFile");

  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the quote display using textContent
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
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // Event listener for showing a random quote
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Create and display the add quote form on page load
  createAddQuoteForm();

  // Show an initial quote
  showRandomQuote();

  // Event listener for import file input
  importFileInput.addEventListener("change", importFromJsonFile);

  // Create export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes";
  exportBtn.addEventListener("click", exportToJsonFile);
  document.body.appendChild(exportBtn);
});
