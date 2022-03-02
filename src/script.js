const apiURL = `https://api.adviceslip.com/advice`;
const btnGenerate = document.querySelector(".advice-card__btn");
const adviceID = document.getElementById("advice-id");
const qouteContainer = document.querySelector(".advice-card__qoute");
const bookmark = document.querySelector(".advice-card__bookmark");
const bookmarkList = document.querySelector(".nav__bookmark-display-list");

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
  state.data = data.slip;
  const qoute = data.slip.advice;
  renderQoute(data);
}
function renderBookmarks() {
  let bookmarkMarkup = "";
  state.bookmarks.forEach((bookmark) => {
    bookmarkMarkup += `
    <li class="nav__bookmark-display-list-item" data-id="${bookmark.id}">
    <svg class="qoute__icon">
    <use xlink:href="images/sprite.svg#icon-quote"></use>
    </svg>
    <p class="list-text">${formatQoute(bookmark.advice)}</p>
    </li>`;
  });
  bookmarkList.innerHTML = "";
  bookmarkList.insertAdjacentHTML("afterbegin", bookmarkMarkup);
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
  inBookmarks(data.slip);

  const qouteHTML = ` 
    <q class="advice-card__text">
    ${data.slip.advice}
    </q>`;
  qouteContainer.innerHTML = "";
  adviceID.innerText = "";
  adviceID.innerText = `#${data.slip.id}`;
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
  persistBookmarks();
}

function persistBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}
//* Checks IF the qoute is in out bookmarks
function inBookmarks(data) {
  console.log(
    "Qoute in Bookmarks?",
    state.bookmarks.find((b) => b.id === state.data.id)
  );

  if (!state.bookmarks.find((b) => b.id === state.data.id)) {
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
