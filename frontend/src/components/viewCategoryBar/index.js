import React, { useState } from 'react';
import './index.scss';
import Button from '../button';
import { HiChevronDown, HiX } from 'react-icons/hi';
import { useSpring, animated } from 'react-spring';

const ViewCategoryBar = ({ categorys,  onSelectViewCategory, onHide }) => {
	const [currentCategory, setCurrentCategory] = useState(0)
	const [isMore, setMore] = useState(false);

	const spring = useSpring({
		transform: isMore ? 'rotate(180deg)' : 'rotate(0deg)',
		opacity: isMore ? 0.5 : 1,
	})

	const onSelectCategory = (index) => {
		setCurrentCategory(index);
		onSelectViewCategory(index);
	}

	return (
		<div className="view-Bar-container">
			<div className="view-bar-content">
				<h3>{categorys[currentCategory].name}</h3>
				<div className="view-bar-color-container">
					{categorys[currentCategory].colors.map(col => <div className="view-bar-color" key={col} style={{backgroundColor: col}}/>)}
				</div>
				<animated.button style={spring} className="view-bar-more" onClick={() => setMore(!isMore)}>
					<HiChevronDown />
				</animated.button>

				<button className="view-bar-hide" onClick={() => onHide()}>
					<HiX />
				</button>

				{isMore && categorys.map((cat, i) => (
					<button className="view-bar-select" onClick={() => onSelectCategory(i)}>
						<h3>{cat.name}</h3>
						<div className="view-bar-color-container">
							{cat.colors.map(col => <div className="view-bar-color" style={{backgroundColor: col}}/>)}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

export default ViewCategoryBar;