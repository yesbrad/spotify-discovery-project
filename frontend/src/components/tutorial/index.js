import React, { useState } from 'react';
import './index.scss';
import Button from '../button';
import { HiChevronDown } from 'react-icons/hi';
import { useSpring, animated } from 'react-spring';

const Tutorial = ({ isTutorial }) => {
	const spring = useSpring({
		transform: isTutorial ? 'translateY(0)' : 'translateY(-100)',
		opacity: isTutorial ? 1 : 0,
	})

	return (
		<animated.div style={spring} className="tutorial-container">
			<h1>
				Use the Search Bar above to search Genres!
			</h1>
		</animated.div>
	)
}

export default Tutorial;