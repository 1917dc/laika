const requisicao = fetch(`https://pokeapi.co/api/v2/pokemon/1`)
const json = requisicao.then(function (response) {
    return response.json();
})
json.then(function (data) {
    const pokemonDiv = document.getElementById('pokemonInfo');
    pokemonDiv.innerHTML =
        `<h2>${data.name}</h2>
<img src="${data.sprites.front_default}" alt="${data.name}" />
`;
})
json.catch(function (error) {
    console.log(error)
})