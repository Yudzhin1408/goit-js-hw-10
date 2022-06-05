import './css/styles.css';
import Notiflix from 'notiflix';
import API from './js/fetchCountries';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const ref = {
  inputEL: document.querySelector('#search-box'),
  ulEl: document.querySelector('.country-list'),
  divInfoEl: document.querySelector('.country-info'),
};

ref.inputEL.addEventListener('input', debounce(sorcheContry, DEBOUNCE_DELAY));

function sorcheContry(e) {
	const name = e.target.value.trim();
  if (!name.length) {
    ref.ulEl.innerHTML = '';
  }
  if (name.length) {
    API.fetchCountries(name).then(renderListContry).catch(onFetchError);
  }
}
function renderListContry(contrys) {
  if (contrys.length > 10) {
    ref.ulEl.innerHTML = '';
    ref.divInfoEl.innerHTML = '';
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (contrys.length === 1) {
    const markup = contrys
      .map(contry => {
        const { flags, name, population, capital, languages } = contry;
        return `<div class="card-icon-name">
				<img class="card-icon" width="30"  src="${flags.svg}" alt="${name}">
				<h2 class="card-name">${name.common}</h2>
			</div>
			<div class="card-body">
				<p class="card-text"><span>Capital:</span> ${capital}</p>
				<p class="card-text"><span>Population:</span> ${population}</p>
				<p class="card-text"><span>Languages:</span> ${Object.values(languages)}
				</p>
			</div>`;
      })
      .join(' ');
    ref.ulEl.innerHTML = '';
    return (ref.divInfoEl.innerHTML = markup);
  }
  const markup = contrys
    .map(contry => {
      const { flags, name } = contry;
      return `<li class="item-cantry">
		<img width="30"  src="${flags.svg}" alt="${name}">
		${name.common}
		</li>`;
    })
    .join(' ');
  ref.divInfoEl.innerHTML = '';
  ref.ulEl.innerHTML = markup;
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  ref.ulEl.innerHTML = '';
  ref.divInfoEl.innerHTML = '';
}