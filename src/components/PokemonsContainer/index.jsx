import React from 'react';
import { Container } from 'nes-react';
import Columns from 'react-columns';
import { Link } from 'react-router-dom';

import { pokemonsQueries } from '../../shared/columnsQueries';

import './style.css';
import '../../shared/style.css';

const PokemonsContainer = ({ pokemons }) =>
	pokemons.length > 0 ? (
		<div className="pokemons-container">
			<Columns queries={pokemonsQueries}>
				{pokemons.map((pokemon, index) => (
					<Link to={`/pokemon/${pokemon.name}`} className="link-pokemon">
						<Container centered title={pokemon.name} key={index} className="pokemon-card">
							{ pokemon.img_url ? <img src={pokemon.img_url} alt={`Front of ${pokemon.name}`} /> : <p>No picture</p>}
						</Container>
					</Link>
				))}
			</Columns>
		</div>
	) : (
		<h2>Loading...</h2>
	);
export default PokemonsContainer;
