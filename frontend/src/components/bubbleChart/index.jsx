import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const BubbleChart = ({ data, onPlayTrack, viewCategory }) => {
	const svgRef = useRef(null);
	const zoomRef = useRef(null);
	const [refrsh, setRefresh] = useState(1);

	const getSize = (artist) => {
		const size = (artist.popularity / 2) * 8 + 40; 
		return size;
	}

	const getTextSize = (artist) => {
		return (artist.popularity * 0.5) + 5;
	}

	const getColor = (artist) => {
		const value = artist.topTrackFeatureData?.[viewCategory.id];
		if (value == null || !Array.isArray(viewCategory.colors) || !viewCategory.colors.length) {
			return viewCategory.colors?.[0] ?? '#999';
		}
		const index = Math.min(9, Math.max(0, Math.floor(value * 10)));
		return viewCategory.colors[index];
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
			.style('z-index', '-30')
			.on('mouseover', function(d) {
				// raise the whole group so text stays above the circle
				d3.select(this.parentNode).raise();

				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeCubicOut)
					.attr('r', getSize(d) * 1.08)
					.style('stroke', '#ffffff')
					.style('stroke-width', 3);
			})
			.on('mouseout', function(d) {
				d3.select(this)
					.transition()
					.duration(200)
					.ease(d3.easeCubicOut)
					.attr('r', getSize(d))
					.style('stroke-width', 0);
			})
			.on('click', (d) => {
				//console.log(d.topTrackData.tracks[0]);
				onPlayTrack(d.topTrackData.tracks, 0);
				d.hasPlayed = true;
				setRefresh(0);
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
