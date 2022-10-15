import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import fetchCountry from './fetch-country';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const container = document.querySelector('.country-info');
const nameInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
nameInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  fetchCountry(event.target.value)
    .then(country => {
      if (country.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryList.innerHTML = '';
        container.innerHTML = '';
      } else if (country.length >= 2 && country.length < 10) {
        countryList.innerHTML = '';
        makePreview(country);
      } else if (country.length === 1) {
        renderCountryCard(country);
        console.log(country[0].capital[0]);
        if (country[0].capital[0] === 'Kyiv') {
          Notify.info('Слава');
          Notify.warning('Україні');
        }
        if (country[0].capital[0] === 'Moscow') {
          Notify.failure('путін ХУЙЛО');
        }
      }

      if (country.status >= 400) {
        return response.json();
      }
    })
    .catch(error => {
      Notify.failure(
        `Oops, there is no country with that name ${event.target.value}`
      );
      countryList.innerHTML = '';
    });
}

function renderCountryCard(country) {
  const countryCard = country => {
    const { name, capital, population, flags, languages } = country;

    return `<h1 class="country-name">Країна: ${name.official}</h1>
        <p class="capital">Столиця: ${capital}</p>
        <p class="population">Населення: ${population} чол.</p>
        <img src="${flags.svg}" alt="${name.official}" width = "300"  />
        <p class="languages">Мова: ${languages}</p>`;
  };
  if (name === 'Ukraine') {
    Notify.info('Слава');
    Notify.info('Україні');
  }
  const markup = country.map(countryCard).join(' ');
  countryList.innerHTML = '';
  container.innerHTML = markup;
}

function makePreview(country) {
  const countryCard = country => {
    const { name, flags } = country;

    return `<li class="country-Preview"><span><img src="${flags.svg}" alt="${name.official}" width = "30"  /></span> <span>${name.official}<span></li>`;
  };
  const markup = country.map(countryCard).join(' ');
  container.innerHTML = '';
  countryList.innerHTML = markup;
}
