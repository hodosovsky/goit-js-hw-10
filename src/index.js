import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  timeout: 3000,
  width: '300px',
});

import fetchCountry from './fetch-country';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const container = document.querySelector('.country-info');
const nameInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
nameInput.placeholder = 'Country Name...';
nameInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  let countryName = event.target.value.trim();

  if (countryName === '') {
    nameInput.style.borderColor = '';
    nameInput.style.outlineColor = '';
    countryList.innerHTML = '';
    container.innerHTML = '';
  } else {
    fetchCountry(countryName)
      .then(country => {
        if (country.length >= 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          nameInput.style.borderColor = '#FF0000';
          nameInput.style.outlineColor = '#FF0000';
          countryList.innerHTML = '';
          container.innerHTML = '';
        } else if (country.length >= 2 && country.length < 10) {
          countryList.innerHTML = '';
          makePreview(country);
          nameInput.style.borderColor = '#00FF00';
          nameInput.style.outlineColor = '#00FF00';
        } else if (country.length === 1) {
          renderCountryCard(country);
          nameInput.style.borderColor = '#00FF00';
          nameInput.style.outlineColor = '#00FF00';
          if (country[0].capital[0] === 'Kyiv') {
            Notify.info('Слава');
            Notify.warning('Україні');
          }
          if (country[0].capital[0] === 'Moscow') {
            Notify.failure('<sup>п</sup>утін ХУЙЛО');
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
        nameInput.style.borderColor = '#FF0000';
        nameInput.style.outlineColor = '#FF0000';
        console.log(error);
        countryList.innerHTML = '';
      });
  }
}

function renderCountryCard(country) {
  const countryCard = country => {
    const { name, capital, population, flags, languages } = country;

    return `<h1 class="country-name"><span><img src="${flags.svg}" alt="${
      name.common
    }" width = "30"  /></span> ${name.official}</h1>
            <p class="capital"><span>Capital:</span> ${capital}</p>
            <p class="population"><span>Population:</span> ${population}</p>
            <p class="languages"><span>Language:</span> ${Object.values(
              languages
            ).join(', ')}</p>
            <img src="${flags.svg}" alt="${name.common}" width = "300"  />`;
  };

  const markup = country.map(countryCard).join(' ');
  countryList.innerHTML = '';

  container.innerHTML = markup;
}

function makePreview(country) {
  const countryCard = country => {
    const { name, capital, population, flags, languages } = country;

    return `<a href="https://en.wikipedia.org/wiki/${name.common}" target="_blank" rel="noopener noreferrer nofollow">
    <li class="country-Preview"><span><img src="${flags.svg}" alt="${name.common}" width = "30" /></span>  <span>${name.official}<span>
    </li></a>`;
  };
  const markup = country.map(countryCard).join(' ');
  container.innerHTML = '';
  countryList.innerHTML = markup;
}
