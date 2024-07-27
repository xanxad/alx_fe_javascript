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

  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the quote display with innerHTML
    quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
  }

  // Function to create and display the form for adding new quotes
  function createAddQuoteForm() {
    formContainer.innerHTML = `
          <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
          <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
          <button id="addQuoteBtn">Add Quote</button>
      `;

    // Select the new form elements
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    // Function to add a new quote
    function addQuote() {
      const quoteText = newQuoteText.value.trim();
      const quoteCategory = newQuoteCategory.value.trim();

      if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);

        // Clear the input fields
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        alert("New quote added successfully!");
      } else {
        alert("Please enter both quote text and category.");
      }
    }

    // Event listener for adding a new quote
    addQuoteBtn.addEventListener("click", addQuote);
  }

  // Event listener for showing a random quote
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // Create and display the add quote form on page load
  createAddQuoteForm();

  // Show an initial quote
  showRandomQuote();
});
