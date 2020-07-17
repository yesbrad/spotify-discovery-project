import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { zoom } from 'd3';

const BubbleChart = ({ data, onPlayTrack }) => {
	const svgRef = useRef(null);
	const zoomRef = useRef(null);

	const getSize = (artist) => {
		
		const size = (artist.popularity / 2) / (1 - (window.innerWidth / 1920)) + 50; 
		return size;
	}

	const getTextSize = (artist) => {
		return (artist.popularity * 0.3) + 10;
	}

	const getColor = (artist) => {
		return artist.topTrackFeatureData.energy > 0.5 ? 'blue' : 'tomato';
	}

	useEffect(() => {
		if (!data) return;

		const height = window.innerHeight;
		const width = window.innerWidth;

		const simulation = d3.forceSimulation(data)
			.force('charge', d3.forceManyBody().strength(500))
			.force('center', d3.forceCenter(width / 2, height / 2))
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
			.attr('class', 'hatty')
			.attr('transform', `translate(${width / 2}, ${height / 2})`)
		
		const circle = bubble
			// .append('a')
			// .attr('href', d => {
			// 	return d.external_urls.spotify
			// })
			// .attr('target', '_blank')
			.append('circle')
			.attr('r', d => getSize(d))
			// .attr('onclick', d => `onPlayTrack(${d.topTrackData.tracks[0].uri}}`)
			.style('fill', d => `${getColor(d)}`)
			.on('click', (d) => {
				console.log('YO WE CLICKED');
				onPlayTrack(d.topTrackData.tracks[0].uri);
			})
			
		
		const text = bubble
			.append('text')
			.text(d => d.name)
			.style('text-anchor', 'middle')
			.style('dominant-baseline', "middle")
			.style('font-size', d => `${getTextSize(d)}px`)
			.style('font-weight', 600)
			.attr('fill', 'white')
			.style('overflow', 'hidden');
		
		simulation.alpha(1).restart();
		
		simulation.nodes(data).on('tick', () => {
			bubble.attr('transform', d => `translate(${d.x}, ${d.y})`)
			// ds.attr("cx", d => d.x).attr("cy",d => d.y)
		})
	}, [data])

	return <svg style={{position: 'fixed', top: 0, zIndex: -100}} className="mainsvg" ref={svgRef}><g className="zoomCon" ref={zoomRef}></g></svg>
}

export default BubbleChart;
