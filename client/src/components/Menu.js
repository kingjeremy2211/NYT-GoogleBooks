import { FaHome } from 'react-icons/lib/fa/';
import { MdStar } from 'react-icons/lib/md/';
import { GoMarkGithub } from 'react-icons/lib/go/';
import React from 'react';
export const Menu = ({setVisibility, visibility}) => {
	
	const color = { color: '#BDBDBD'};

	const showFavorites = () => {
		console.log(visibility);
		setVisibility({
				highlight: false,
				booklist: false,
				favorites: true
			
		});
		
	}

	const showHome = () => {
		setVisibility({
			highlight: false,
			booklist: true,
			favorites: false
		});

	}

	return (
		<nav aria-label="App navigation" id="app-nav">
			<span>{visibility.favorites ? 
				<MdStar style={color} /> : 
				<MdStar onClick={() => showFavorites()}/>}</span>
			<span>{visibility.favorites ?
				<FaHome onClick={() => showHome()}/> :
			    <FaHome style={color} /> }</span>
			<span><a href="https://github.com/kingjeremy2211/NYT-Googlebooks"><GoMarkGithub /></a></span>
		</nav>
	)
}