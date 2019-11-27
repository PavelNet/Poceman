import React, {useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import Columns from 'react-columns';
import { Container } from 'nes-react';

import '../../shared/style.css';
import { pokemonsQueries } from '../../shared/columnsQueries';
import PokemonsContainer from '../../components/PokemonsContainer';

const Saved = () => {
    const [pokemons,setPokemons] = useState([]);

    useEffect(() => {
        const savedPokemonsJson = localStorage.getItem('saved_list');
        const savedPokemons = JSON.parse(savedPokemonsJson);
        const _pokemons = savedPokemons.map(pokemon => {
            const pokemonJson = localStorage.getItem(pokemon);
            return JSON.parse(pokemonJson);
        });
        setPokemons(_pokemons);
    }, []);

    return (
        <div>
            <h1>Your favorites pokémons</h1>
            <PokemonsContainer pokemons={pokemons}/>
        </div>
    )
}

export default Saved;
