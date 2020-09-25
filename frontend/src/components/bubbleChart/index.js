import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { rgb } from 'd3';

const BubbleChart = ({ data, onPlayTrack, viewCategory }) => {
	const svgRef = useRef(null);
	const zoomRef = useRef(null);

	const getSize = (artist) => {
		const size = (artist.popularity / 2) * 5; 
		return size;
	}

	const getTextSize = (artist) => {
		return (artist.popularity * 0.3) + 10;
	}

	const getColor = (artist) => {
		return viewCategory.colors[Math.floor(artist.topTrackFeatureData[viewCategory.id] * 10)];
	}

	useEffect(() => {
		if (!data) return;


		const height = window.innerHeight;
		const width = window.innerWidth;

		const simulation = d3.forceSimulation(data)
			.force("x", d3.forceX(width / 2).strength(0.001))
			.force("y", d3.forceY(height / 2).strength(0.001))
			.force('collide', d3.forceCollide(d => getSize(d)))

		// Remove all of the old element when we update data
		d3.selectAll('.hatty').remove();

		const ds = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height)
			.call(d3.zoom().on("zoom", function () {
				ds.attr("transform", d3.event.transform)
			}))
			.selectAll('.zoomCon')

		const bubble = d3
			.select(zoomRef.current)
			.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			// .merge(ds)
			.attr('class', 'hatty')
			.attr('transform', `translate(${width}, ${0})`)
		
			// bubble.exit().remove();;
				
		const circle = bubble
			.append('circle')
			.attr('r', d => getSize(d))
			.style('fill', d => getColor(d))
			.on('click', (d) => {
				console.log(d.topTrackData.tracks[0]);
				onPlayTrack(d.topTrackData.tracks, 0);
				d.hasPlayed = true;
			})
			
		bubble
			.append('text')
			.text(d => d.name)
			.style('text-anchor', 'middle')
			.style('dominant-baseline', "middle")
			.style('font-size', d => `${getTextSize(d)}px`)
			.style('font-weight', d => d.hasPlayed ? 100 : 600 )
			.attr('fill', 'white')
			.attr('pointer-events', 'none')
			.style('overflow', 'hidden');
		
		
		simulation.restart();

		simulation.nodes(data).on('tick', () => {
			bubble.attr('transform', d => `translate(${d.x}, ${d.y})`)
			// ds.attr("cx", d => d.x).attr("cy",d => d.y)
		})
	}, [data, viewCategory])

	return <svg style={{position: 'fixed', top: 0, zIndex: -100}} className="mainsvg" ref={svgRef}><g className="zoomCon" ref={zoomRef}></g></svg>
}

export default BubbleChart;
