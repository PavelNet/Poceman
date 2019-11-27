import api from '../../services/api';

async function fetchEvolution(url) {
    const response = await api.get(url);
    const chain = response.data['chain'];
    const evolution_chain = [];

    evolution_chain.push(chain['species']['name']);

    function getEvolutionChain(evolves_to) {
        if (evolves_to[0]['evolves_to'].length == 0) {
            evolution_chain.push(evolves_to[0]["species"]["name"]);
            return;
        };

        evolution_chain.push(evolves_to[0]["species"]["name"]);
        getEvolutionChain(evolves_to[0]['evolves_to']);
    }

    if (chain.evolves_to.length > 0) getEvolutionChain(chain.evolves_to);
    return evolution_chain;
}

async function fetchEvolutionPokemons(url) {
    const evolution_chain = await fetchEvolution(url);
    console.log(evolution_chain);
    const evolution_pokemons = [];
    for (const i in evolution_chain) {
        const response = await api.get(`/pokemon/${evolution_chain[i]}`);
        const data = response.data;
        evolution_pokemons.push({
            id: data['id'],
            name: data['name'],
            img_url: data['sprites']['front_default'],
        });
    }


    return evolution_pokemons;
}

async function fetchSpecie(name) {
    const response = await api.get(`/pokemon-species/${name}/`);
    const data = response.data;

    let flavor_text;
    for (let i in data['flavor_text_entries']) {
        const entrie = data['flavor_text_entries'][i]
        if (entrie['language']['name'] == 'en') {
            flavor_text = entrie['flavor_text'];
            break;
        }
    }

    const evolution = await fetchEvolutionPokemons(data['evolution_chain']['url']);

    return { flavor_text, evolution };
}


export default async function fetchPokemon(id) {
    let response;
    try {
        response = await api.get(`/pokemon/${id}/`);
    } catch (e) {
        return { status: 'ERROR' };
    }
    const data = response.data;


    const types = data['types'].map(type => type['type']);
    const abilities = data['abilities'].map(ability => ability['ability']);
    const stats = {
        speed: data['stats'][0]['base_stat'],
        special_defense: data['stats'][1]['base_stat'],
        special_attack: data['stats'][2]['base_stat'],
        defense: data['stats'][3]['base_stat'],
        attack: data['stats'][4]['base_stat'],
        hp: data['stats'][5]['base_stat'],
    };

    const specie = await fetchSpecie(data['species']['name']);

    return {
        status: 'OK',
        id: data['id'],
        name: data['name'],
        front_sprite: data['sprites']['front_default'],
        back_sprite: data['sprites']['back_default'],
        abilities,
        types,
        stats,
        flavor_text: specie.flavor_text,
        evolution: specie.evolution,
    }
} 