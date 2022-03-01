const apiURL = `https://api.adviceslip.com/advice`;
const btnGenerate = document.querySelector(".advice-card__btn");
const adviceID = document.getElementById("advice-id");
const qouteContainer = document.querySelector(".advice-card__qoute");

async function getQoute() {
  renderSpinner();
  const res = await fetch(apiURL);
  const data = await res.json();
  console.log(data);
  const qoute = data.slip.advice;

  renderQoute(data);
}

function renderQoute(data) {
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
        <use xlink:href="images/sprite.svg#icon-loader"></use>
    </svg>
  </div>`;
  qouteContainer.innerHTML = "";
  qouteContainer.innerHTML = spinnerHTML;
}

btnGenerate.addEventListener("click", getQoute);
