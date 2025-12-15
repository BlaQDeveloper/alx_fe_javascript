// 1. Select existing DOM elements from index.html
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

// 2. Data for quotes
let quotes = [
  { text: 'The future depends on what you do today.', category: 'Motivation' },
  { text: 'Code is like humor. When you have to explain it, it’s bad.', category: 'Programming' },
  { text: 'Simplicity is the soul of efficiency.', category: 'Productivity' }, 
  { text: 'The only way to do great work is to love what you do.', category: 'Motivation' },
  { text: 'The best way to predict the future is to invent it.', category: 'Innovation' },
  { text: 'It always seems impossible until it is done.', category: 'Motivation' },
  { text: 'Perfection is not attainable, but if we chase perfection we can catch excellence.', category: 'Inspiration' },
  { text: 'It is never too late to be what you might have been.', category: 'Inspiration' },
];

// 3. A function that creates and updates DOM content
function showRandomQuote() {
  // Clear whatever was there before
  quoteDisplay.innerHTML = '';

  // Pick a random quote from the array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Create new DOM elements
  const quoteTextEl = document.createElement('p');
  quoteTextEl.textContent = `"${quote.text}"`;

  const quoteCategoryEl = document.createElement('span');
  quoteCategoryEl.textContent = `Category: ${quote.category}`;
  quoteCategoryEl.style.display = 'block';
  quoteCategoryEl.style.fontStyle = 'italic';

  // Add (append) the new elements into the page
  quoteDisplay.appendChild(quoteTextEl);
  quoteDisplay.appendChild(quoteCategoryEl);
}

// 4. Handle "Add Quote" button click (called from HTML or JS)
function addQuote() {
  const text = newQuoteTextInput.value.trim();
  const category = newQuoteCategoryInput.value.trim();

  if (!text) {
    alert('Please enter a quote before adding.');
    return;
  }

  if (!category) {
    alert('Please enter a category before adding.');
    return;
  }

  // Add new quote to our data array
  quotes.push({ text, category });

  // Clear the inputs
  newQuoteTextInput.value = '';
  newQuoteCategoryInput.value = '';

  // Optionally show the new quote immediately
  quoteDisplay.innerHTML = '';
  const quoteTextEl = document.createElement('p');
  quoteTextEl.textContent = `"${text}"`;
  const quoteCategoryEl = document.createElement('span');
  quoteCategoryEl.textContent = `Category: ${category}`;
  quoteCategoryEl.style.display = 'block';
  quoteCategoryEl.style.fontStyle = 'italic';
  quoteDisplay.appendChild(quoteTextEl);
  quoteDisplay.appendChild(quoteCategoryEl);
}

// 5. Listen for user interactions (click events)
newQuoteBtn.addEventListener('click', showRandomQuote);
// The "Add Quote" button already calls addQuote() via onclick in HTML,
// but we can also attach the event here for clarity:
addQuoteBtn.addEventListener('click', addQuote);

// 6. Optionally show an initial quote when the page loads
showRandomQuote();
