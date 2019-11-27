import React from 'react'
import './ClickArea.css';

import PropTypes from 'prop-types'

const ClickArea = props => <button id='click-area' {...props}></button>

ClickArea.propTypes = {
    onClick: PropTypes.func,
}

export default ClickArea

