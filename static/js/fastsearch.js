var searchInput = document.getElementById('search-input');
var searchResultContainer = document.getElementById('search-results');
var fuse = null;

if (searchInput) {
  fetch(window.location.origin + '/index.json').then(res => res.json()).then(data => {
    fuse = new Fuse(data, fuseOpts);
    searchInput.addEventListener('input', performSearch);
  });
}

function performSearch(e) {
  var results = fuse.search(e.target.value);
  renderResults(results);
}

function renderResults(results) {
  if (!searchResultContainer) return;
  searchResultContainer.innerHTML = '';

  if (results.length === 0) {
    searchResultContainer.innerHTML = '<p>No results found</p>';
    return;
  }

  results.forEach(result => {
    var item = result.item;
    var div = document.createElement('div');
    div.className = 'search-result';
    div.innerHTML = `
      <h3><a href="${item.permalink}">${item.title}</a></h3>
      <p>${item.summary || ''}</p>
    `;
    searchResultContainer.appendChild(div);
  });
}
