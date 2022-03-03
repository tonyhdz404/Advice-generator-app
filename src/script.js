const apiURL = `https://api.adviceslip.com/advice`;
const btnGenerate = document.querySelector(".advice-card__btn");
const adviceID = document.getElementById("advice-id");
const qouteContainer = document.querySelector(".advice-card__qoute");
const bookmark = document.querySelector(".advice-card__bookmark");
const bookmarkList = document.querySelector(".nav__bookmark-list");
const btnBookmarks = document.querySelector(".nav__bookmarks");

const state = {
  bookmarks: [],
  data: {},
};
function init() {
  const storedBookmarks = JSON.parse(window.localStorage.getItem("bookmarks"));
  if (!storedBookmarks) return;
  storedBookmarks.forEach((bookmark) => {
    state.bookmarks.push(bookmark);
  });
  renderBookmarks();
  console.log(state.bookmarks);
}
init();
async function getQoute() {
  renderSpinner();
  const res = await fetch(apiURL);
  const data = await res.json();
  console.log(data);
  state.data = data.slip;

  renderQoute(data.slip);
}
function renderBookmarks() {
  let bookmarkMarkup = "";
  state.bookmarks.forEach((bookmark) => {
    bookmarkMarkup += `
    <li class="nav__bookmark-list-item" data-id="${bookmark.id}">
    <svg class="qoute__icon">
    <use xlink:href="images/sprite.svg#icon-quote"></use>
    </svg>
    <p class="list-text">${formatQoute(bookmark.advice)}</p>
    </li>`;
  });
  bookmarkList.innerHTML = "";
  bookmarkList.insertAdjacentHTML("afterbegin", bookmarkMarkup);
}
function findBookmark(id) {
  return state.bookmarks.find((b) => {
    return b.id === id;
  });
}

function formatQoute(qoute) {
  if (qoute.length > 30) {
    const formatted = qoute.split("");
    formatted.splice(30);
    formatted.pop();
    formatted.push("...");
    return formatted.join("");
  } else {
    return qoute;
  }
}

function renderQoute(data) {
  inBookmarks(data);

  const qouteHTML = ` 
    <q class="advice-card__text">
    ${data.advice}
    </q>`;
  qouteContainer.innerHTML = "";
  adviceID.innerText = "";
  adviceID.innerText = `#${data.id}`;
  qouteContainer.innerHTML = qouteHTML;
}

function renderSpinner() {
  const spinnerHTML = `
  <div class="spinner">
    <svg class="spinner__icon">
        <use xlink:href="images/sprite.svg#icon-spinner"></use>
    </svg>
  </div>`;
  qouteContainer.innerHTML = "";
  qouteContainer.innerHTML = spinnerHTML;
}

//* Adds bookmarks to state bookmarks array
function addBookmark() {
  if (state.bookmarks.includes(state.data))
    return console.log("Already bookmarked");
  bookmark.classList.add("bookmarked");
  state.bookmarks.push(state.data);
  console.log("Added to bookmarks", state.bookmarks);
  renderBookmarks();
  persistBookmarks();
}
function removeBookmark() {
  console.log("Before", state.bookmarks);
  bookmark.classList.remove("bookmarked");
  const index = state.bookmarks.findIndex((bookmark) => {
    return bookmark.id === state.data.id;
  });
  console.log(index);
  state.bookmarks.splice(index, 1);
  console.log("After", state.bookmarks);
  renderBookmarks();
  persistBookmarks();
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}
//* Checks IF the qoute is in out bookmarks
function inBookmarks(data) {
  console.log(
    "Qoute in Bookmarks?",
    state.bookmarks.find((b) => b.id === data.id)
  );

  if (!state.bookmarks.find((b) => b.id === data.id)) {
    bookmark.classList.remove("bookmarked");
  } else {
    bookmark.classList.add("bookmarked");
  }
}
//* Event Listeners

//? Generates the qoute and renders it to screen
btnGenerate.addEventListener("click", getQoute);

//? Shows bookmark icon after the first click
btnGenerate.addEventListener(
  "click",
  function () {
    bookmark.classList.remove("hidden");
  },
  { once: true }
);
//? Add the "bookmarked" class when clicked
bookmark.addEventListener("click", function (e) {
  if ([...bookmark.classList].includes("bookmarked")) {
    removeBookmark();
  } else {
    addBookmark();
  }
});

//? Render the Clicked on Bookmark
bookmarkList.addEventListener("click", function (e) {
  bookmark.classList.remove("hidden");
  console.log("Clicked");
  const bookmarkClicked = e.target.closest(".nav__bookmark-list-item");
  if (!bookmarkClicked) return;
  const bookmarkID = +bookmarkClicked.dataset.id;
  const data = findBookmark(bookmarkID);
  console.log(data);
  state.data = data;
  renderQoute(data);
});
