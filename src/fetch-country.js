function fetchCountry(countryName) {
  return fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fullText=true,fields=name,capital,population,flags,languages`
  ).then(response => {
    return response.json();
  });
}

export default fetchCountry;
