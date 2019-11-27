import React from 'react';
import { Button } from 'nes-react';

import './style.css';
const FilterButton = props => (
	<a href={`/type/${props.filter}`}>
		<Button className="filter-button">{props.filter}</Button>
	</a>
);

export default FilterButton;
