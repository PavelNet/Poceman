import React, { useState, useEffect } from 'react';
import { Container, Progress, Button } from 'nes-react';
import { Row, Col } from 'react-flexbox-grid';

import fetchPokemon from './requests';
import './style.css';
import '../../shared/style.css';
import ClickArea from '../../components/ClickArea';

const Pokemon = props => {
	const { id } = props.match.params;
	const [pokemon, setPokemon] = useState({
		id: 0,
		name: '',
		front_sprite: '',
		back_sprite: '',
		abilities: [{}],
		types: [{}],
		stats: {},
		flavor_text: '',
		evolution: [],
	});
	const [pokemonSaved, setPokemonSaved] = useState(false);

	useEffect(() => {
		async function loadPokemon() {
			const pokemon = await fetchPokemon(id);
			setPokemon(pokemon);
			setPokemonSaved(localStorage.getItem(pokemon.name));
		}
		loadPokemon();
	}, []);

	const savePokemon = () => {
		localStorage.setItem(
			pokemon.name,
			JSON.stringify({ id: pokemon.id, name: pokemon.name, img_url: pokemon.front_sprite })
		);
		setPokemonSaved(true);
		const saved_list_json = localStorage.getItem('saved_list');
		let savedList = JSON.parse(saved_list_json);
		if (!savedList) savedList = [];
		savedList.push(pokemon.name);
		localStorage.setItem('saved_list', JSON.stringify(savedList));
	};

	const removePokemon = () => {
		localStorage.removeItem(pokemon.name);
		setPokemonSaved(false);
		const saved_list_json = localStorage.getItem('saved_list');
		let savedList = JSON.parse(saved_list_json);
		if (savedList) {
			savedList = savedList.filter(e => e != pokemon.name);
			localStorage.setItem('saved_list', JSON.stringify(savedList));
		}
	};

	return (
		<>
			{pokemon.status == 'ERROR' ? (
				<p>No results or something gone wrong :( </p>
			) : pokemon.id > 0 ? (
				<div>
					<Row between="md">
						<Col>
							<h1>
								#{pokemon.id} {pokemon.name}
							</h1>
						</Col>

						<Col>
							{pokemonSaved ? (
								<ClickArea onClick={removePokemon}>
									<Button>Unfavorite</Button>
								</ClickArea>
							) : (
								<ClickArea onClick={savePokemon}>
									<Button>Favorite</Button>
								</ClickArea>
							)}
						</Col>
					</Row>
					<p>{pokemon.flavor_text}</p>
					<Row top="lg">
						<Col lg={4} md={12} sm={12}>
							{pokemon.front_sprite ? (
								<img
									alt={`Front of ${pokemon.name}`}
									src={pokemon.front_sprite}
									className="pokemon-img"
								/>
							) : (
								<></>
							)}
							{pokemon.back_sprite ? (
								<img
									alt={`Back of ${pokemon.name}`}
									src={pokemon.back_sprite}
									className="pokemon-img"
								/>
							) : (
								<></>
							)}
							<Container title="Types" className="poke-container">
								<ul>
									{pokemon.types.map(type => (
										<li>{type.name}</li>
									))}
								</ul>
							</Container>

							<Container title="Abilities" className="poke-container">
								<ul>
									{pokemon.abilities.map(ability => (
										<li>{ability.name}</li>
									))}
								</ul>
							</Container>
						</Col>
						<Col lg={8} md={12} sm={12}>
							<Container title="Stats">
								HP {pokemon.stats.hp}
								<Progress value={pokemon.stats.hp} max={255} success />
								Attack {pokemon.stats.attack}
								<Progress value={pokemon.stats.attack} max={190} error />
								Defense {pokemon.stats.defense}
								<Progress value={pokemon.stats.defense} max={230} warning />
								Special Attack {pokemon.stats.special_attack}
								<Progress value={pokemon.stats.special_attack} max={194} error />
								Special Defense {pokemon.stats.special_defense}
								<Progress value={pokemon.stats.special_defense} max={230} warning />
								Speed {pokemon.stats.speed}
								<Progress value={pokemon.stats.speed} max={180} primary />
							</Container>
						</Col>
					</Row>
					{pokemon.evolution.length > 1 ? (
						<Container title="Evolution" className="evolution-container">
							<Row around="lg">
								{pokemon.evolution.map((p, index) => (
									<>
										{index > 0 ? <Col>=></Col> : <></>}
										<Col>
											<a href={`/pokemon/${p.name}`} className="link-pokemon">
												<img src={p.img_url} />
												<br />
												{p.name}
											</a>
										</Col>
									</>
								))}
							</Row>
						</Container>
					) : (
						<></>
					)}
				</div>
			) : (
				<h1>Loading...</h1>
			)}
		</>
	);
};

export default Pokemon;
