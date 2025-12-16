// 1. Select existing DOM elements from index.html
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuote');
const exportQuotesBtn = document.getElementById('exportQuotes');
const refreshPostsBtn = document.getElementById('refreshPosts');
const postsList = document.getElementById('postsList');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const categoryFilter = document.getElementById('categoryFilter');

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

function loadQuoteFromStorage() {
  const savedQuotes = localStorage.getItem('quotes');
  
  if (savedQuotes) {
    try {
      const parsed = JSON.parse(savedQuotes);
      if (Array.isArray(parsed)) {
        quotes = parsed;
      }
    } catch (err) {
      console.error('Failed to parse saved quotes', err);
    }
  }
}

function savedQuotesFromStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes))
}

// Function to export quotes to a JSON file
function exportQuotesToJSON() {
  // Convert quotes array to JSON string with pretty formatting
  const jsonString = JSON.stringify(quotes, null, 2);
  
  // Create a Blob with the JSON content
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json'; // Set the filename
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up: remove the link and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// import files from users in form of JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert('Invalid JSON: expected an array of quotes.');
        return;
      }
      importedQuotes.forEach((quote) => {
        if (quote?.text && quote?.category) {
          quotes.push({ text: quote.text, category: quote.category });
        }
      });
      savedQuotesFromStorage();
      populateCategories();
      alert('Quotes imported successfully!');
    } catch (err) {
      alert('Failed to read file. Please check the JSON format.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// 4. Handle "Add Quote" button click (called from HTML or JS)
function createAddQuoteForm() {
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

  savedQuotesFromStorage();

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

function populateCategories() {
  if (!categoryFilter) {
    return;
  }

  const categories = Array.from(
    new Set(
      quotes
        .map(quote => quote.category?.trim())
        .filter(Boolean))
  ).sort();

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const selected = categoryFilter.value;

  if (selected === 'all') {
    showRandomQuote();
    return;
  }

  const selectedCategory = quotes.filter(
    quote => quote.category?.trim() === selected
  );

  quoteDisplay.innerHTML = '';
  const randomIndex = Math.floor(Math.random() * selectedCategory.length);
  const quote = selectedCategory[randomIndex]; 

  const quoteTextEl = document.createElement('p');
  quoteTextEl.textContent = `"${quote.text}"`;

  const quoteCategoryEl = document.createElement('span');
  quoteCategoryEl.textContent = `Category: ${quote.category}`;
  quoteCategoryEl.style.display = 'block';
  quoteCategoryEl.style.fontStyle = 'italic';
  quoteDisplay.appendChild(quoteTextEl);
  quoteDisplay.appendChild(quoteCategoryEl);
}

// 6. Periodic data fetching from JSONPlaceholder to simulate server updates
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
let postsPollTimer = null;

async function fetchQuotesFromServer() {
  if (!postsList) return;

  try {
    const res = await fetch(POSTS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const posts = await res.json();

    // Clear current list
    postsList.innerHTML = '';

    // Render latest posts titles
    posts.forEach((post) => {
      const li = document.createElement('li');
      li.textContent = post.title;
      postsList.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  }
}

function startPostsPolling(intervalMs = 10000) {
  // Clear any existing timer
  if (postsPollTimer) {
    clearInterval(postsPollTimer);
  }

  // Fetch immediately, then on an interval
  fetchQuotesFromServer();
  postsPollTimer = setInterval(fetchQuotesFromServer, intervalMs);
}

function stopPostsPolling() {
  if (postsPollTimer) {
    clearInterval(postsPollTimer);
    postsPollTimer = null;
  }
}

// 5. Listen for user interactions (click events)
newQuoteBtn.addEventListener('click', showRandomQuote);
// The "Add Quote" button already calls addQuote() via onclick in HTML,
// but we can also attach the event here for clarity:
addQuoteBtn.addEventListener('click', createAddQuoteForm);
exportQuotesBtn.addEventListener('click', exportQuotesToJSON);

if (refreshPostsBtn) {
  refreshPostsBtn.addEventListener('click', fetchQuotesFromServer);
}

// 6. Optionally show an initial quote when the page loads
showRandomQuote();
populateCategories();
startPostsPolling(10000);
