import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { forceCenter } from 'd3';

const BubbleChart = ({ data }) => {
	const yeet = useRef(null);
	// const [lastMouse, setLastMouse] = useState({ x: 0, y: 0});

	let lastMouse = { x: 0, y: 0 };

	const getSize = (artist) => {
		// console.log((1 - (window.innerWidth / 1920)));
		
		const size = (artist.popularity / 4) / (1 - (window.innerWidth / 1920)); 

		return size < 50 ? 50 : size;
	}

	const getTextSize = (artist) => {
		return (artist.popularity * 0.1) + 10;
	}

	useEffect(() => {
		if (!data) return;

		const height = window.innerHeight;
		const width = window.innerWidth;

		const simulation = d3.forceSimulation(data)
			.force('charge', d3.forceManyBody().strength(300))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collide', d3.forceCollide(d => getSize(d)))

		const ds = d3
			.select(yeet.current)
			.attr('width', width)
			.attr('height', height)

		// Remove all of the old element when we update data
		ds.selectAll('.hatty').remove();

		let bubble = ds
			.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('class', 'hatty')
	
		const drag = d3.drag().on('start', (d) => {
			// d.fx = d3.event.x;
			// d.fy = d3.event.y;
			// simulation.force('center', d3.forceCenter(lastMouse.x ,lastMouse.y))

			// console.log(lastMouse);

		}).on('drag', (d) => {
			simulation.alpha(0.3).restart();
			d.fx = d3.event.x;
			d.fy = d3.event.y;
			// lastMouse = { x:  d3.event.x, y:  d3.event.y };
			// console.log(lastMouse);
			// ds.selectAll('g').attr("transform", `translate(${d3.event.x}, ${d3.event.y})`);
			
			// simulation.force('center', d3.forceCenter(d3.event.x + lastMouse.x ,d3.event.y + lastMouse.y))
		}).on('end', (d) => {
			console.log(d3.event);
			// lastMouse = { x: d3.event.x, y: d3.event.y };
			console.log(lastMouse);

			d.fx = null;
			d.fy = null;
		})
		
		// ds.selectAll('g').csall(drag)	

		const circle = bubble
			.append('a')
			// .attr('href', 'http://www.google.com')
			.append('circle')
			.attr('r', d => getSize(d))
			.style('fill', `tomato`)
			
		
		const text = bubble
			.append('text')
			.text(d => d.name)
			.style('text-anchor', 'middle')
			.style('dominant-baseline', "middle")
			.style('font-size', d => `${getTextSize(d)}px`)
			// .attr('fill', 'white')
			.style('overflow', 'hidden');
		

		simulation.nodes(data).on('tick', () => {
			bubble.attr('transform', d => `translate(${d.x}, ${d.y})`)
			// ds.attr("cx", d => d.x).attr("cy",d => d.y)
		})

	}, [data])

	return <svg className="mainsvg" ref={yeet} />
}

export default BubbleChart;
