const BASE_URL = 'https://braden-preston-dev-uscities-microservices-haaxd4g4g0bwcbb7.canadacentral-01.azurewebsites.net';

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const responsesElm = document.getElementById('responses');
let searchTimer;
let latestSearchId = 0;

searchButton.addEventListener('click', function () {
  clearTimeout(searchTimer);
  runSearch();
});

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    clearTimeout(searchTimer);
    runSearch();
  }
});

searchInput.addEventListener('input', function () {
  const query = searchInput.value.trim();
  const searchId = ++latestSearchId;

  clearTimeout(searchTimer);

  if (query.length < 2) {
    responsesElm.textContent = '';
    return;
  }

  searchTimer = setTimeout(function () {
    search(searchId);
  }, 300);
});

function runSearch() {
  const searchId = ++latestSearchId;
  search(searchId);
}

async function search(searchId) {
  const query = searchInput.value.trim();

  if (!query) return;

  console.log(`Debug>query: ${query}`);

  try {
    const response = await fetch(
      `${BASE_URL}/uscities-search/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Malformed response');
    }

    if (searchId !== latestSearchId) {
      return;
    }

    displaySearch(data);
  } catch (err) {
    if (searchId !== latestSearchId) {
      return;
    }

    console.log(`Debug>search error: ${err.message}`);
    responsesElm.textContent = 'Error: could not load results.';
  }
}

function displaySearch(data) {
  if (!responsesElm) {
    console.log('Error in getting "responses"');
    return;
  }

  if (data.length === 0) {
    responsesElm.textContent = 'No cities found';
    return;
  }

  if (typeof DOMPurify === 'undefined') {
    console.log('Error in loading DOMPurify');
    responsesElm.textContent = 'Error: could not load results.';
    return;
  }

  const columns = getColumns(data);
  const table = `
    <table>
      <thead>
        <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map((city) => `
          <tr>
            ${columns.map((column) => `<td>${formatCellValue(city[column])}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  responsesElm.innerHTML = DOMPurify.sanitize(table, {
    ALLOWED_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: []
  });
}

function getColumns(data) {
  const columns = new Set();

  data.forEach((city) => {
    Object.keys(city).forEach((column) => columns.add(column));
  });

  return Array.from(columns);
}

function formatCellValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}
