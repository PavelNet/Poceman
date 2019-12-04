import React, { useEffect, useState } from 'react';

import './style.css';
import '../../shared/style.css';
import Columns from 'react-columns';
import { Row, Col } from 'react-flexbox-grid';
import { TextInput, Button, Container, Checkbox } from 'nes-react';

import ClickArea from '../../components/ClickArea';
import { fetchPokemons, fetchTypePokemons, fetchPokemonSearch } from './requests';
import { filterQueries } from '../../shared/columnsQueries';
import FilterButton from './FilterButton';
import PokemonsContainer from '../../components/PokemonsContainer';

const PAGE_SIZE = 20;

const Home = ({ history, match }) => {
  const [page, setPage] = useState(0);
  const [pokemons, setPokemons] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [strictSearch, setStrictSearch] = useState(true);
  const [limit, setLimit] = useState(0);
  const [isOk, setIsOk] = useState(true);

  const { type, search } = match.params;

  const typeList = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];

  useEffect(() => {
    async function loadPokemons() {
      if (type) {
        const result = await fetchTypePokemons(type, page);
        setLimit(result.size);
        setPokemons(result.pokemons);
      } else if (search) {
        const result = await fetchPokemonSearch(search, page);
        setLimit(result.size);
        setPokemons(result.pokemons);
        if (pokemons.length == 0) setIsOk(false);
      } else {
        setLimit(807);
        setPokemons(await fetchPokemons(page));
      }
    }

    loadPokemons();
  }, [page]);

  function changePage(p) {
    setPokemons([]);
    setPage(p);
  }

  function renderPageButton(isPrevious) {
    const pageLimit = Math.ceil(limit / PAGE_SIZE);
    console.log(limit, pageLimit);
    if (isPrevious) {
      return page === 0 ? (
        <></>
      ) : (
          <ClickArea onClick={() => changePage(page - 1)}>
            <Button> {'<'} </Button>
          </ClickArea>
        );
    } else
      return page + 1 === pageLimit ? (
        <></>
      ) : (
          <ClickArea onClick={() => changePage(page + 1)}>
            <Button> {'>'} </Button>
          </ClickArea>
        );
  }

  const handleInput = e => setSearchInput(e.target.value);
  const handleSaved = () => history.push(`/saved/`);
  const openFilters = () => setFilterOpen(!filterOpen);

  return (
    <>
      <Row top="sm" between="lg" className="top">
        <Col lg={5} md={12}>
          <TextInput placeholder="Search for a pokémon" onChange={handleInput} />
          <Checkbox
            checked={strictSearch}
            label="Strict search"
            onSelect={() => setStrictSearch(!strictSearch)}
          />
        </Col>
        <Col lg={1} md={12}>
          <a href={strictSearch ? `/pokemon/${searchInput}` : `/search/${searchInput}`}>
            <Button>Search!</Button>
          </a>
        </Col>
        <Col lg={1} />
        <Col>
          <ClickArea onClick={openFilters}>
            <Button>Filter</Button>
          </ClickArea>
        </Col>
        <Col>
          <ClickArea onClick={handleSaved}>
            <Button>Favorites</Button>
          </ClickArea>
        </Col>
      </Row>

      {filterOpen ? (
        <Container title="Select a type">
          <Columns queries={filterQueries}>
            {typeList.map(type => (
              <FilterButton filter={type} />
            ))}
          </Columns>
        </Container>
      ) : (
          <></>
        )}

      <div className="subtitle">
        {type ? (
          <h2>
            Showing <b>{type}</b> pokemons
					</h2>
        ) : search ? (
          <h2>
            Showing results for <b>"{search}"</b>
          </h2>
        ) : (
              <h2>
                Showing <b>all</b> pokemons
					</h2>
            )}
      </div>

      {isOk ? (
        <>
          <PokemonsContainer pokemons={pokemons} />
          <div className="row">
            {renderPageButton(true)}
            {page + 1}
            {renderPageButton(false)}
          </div>{' '}
        </>
      ) : (
          <p>No results</p>
        )}
    </>
  );
};

export default Home;
