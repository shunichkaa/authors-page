type Author = {
  author: string;
  image: string;
  url: string;
  bio: string;
};

const authorContainer = document.querySelector<HTMLElement>('#author-container');
const loadMoreBtn = document.querySelector<HTMLButtonElement>('#load-more-btn');

let startingIndex = 0;
let endingIndex = 8;
let authorDataArr: Author[] = [];

fetch('https://cdn.freecodecamp.org/curriculum/news-author-page/authors.json')
  .then((res) => res.json())
  .then((data: Author[]) => {
    authorDataArr = data;
    displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
  })
  .catch(() => {
    if (authorContainer) {
      authorContainer.innerHTML = '<p class="error-msg">There was an error loading the authors</p>';
    }
  });

const fetchMoreAuthors = () => {
  startingIndex += 8;
  endingIndex += 8;

  displayAuthors(authorDataArr.slice(startingIndex, endingIndex));
  if (loadMoreBtn && authorDataArr.length <= endingIndex) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.cursor = 'not-allowed';
    loadMoreBtn.textContent = 'No more data to load';
  }
};

const displayAuthors = (authors: Author[]) => {
  if (!authorContainer) return;
  authors.forEach(({ author, image, url, bio }, index) => {
    authorContainer.innerHTML += `
    <div id="${index}" class="user-card">
      <h2 class="author-name">${author}</h2>
      <img class="user-img" src="${image}" alt="${author} avatar">
      <div class="purple-divider"></div>
      <p class="bio">${bio.length > 50 ? bio.slice(0, 50) + '...' : bio}</p>
      <a class="author-link" href="${url}" target="_blank">${author} author page</a>
    </div>
  `;
  });
};

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', fetchMoreAuthors);
}