import React from 'react';
import './App.css';
import { Container, Sprite, Icon } from 'nes-react';
import Routes from './routes';

function App() {
	return (
		<div className="App">
			<a className="title" href='/'>
					<Sprite sprite="pokeball" className="pokeball" />
					<h1>Pokeman</h1>
			</a>

			<Container rounded className="content">
				<Routes />
			</Container>	
		</div>
	);
}

export default App;
