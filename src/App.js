import 'bootstrap/dist/css/bootstrap.min.css';

import './style.css';
import './App.css';

import React, {useEffect, useState} from 'react';
import {Navigate, Route, BrowserRouter as Router, Routes} from 'react-router-dom';

import Preloader from '../src/components/Pre';
import About from './components/About/About';
import Footer from './components/Footer';
import Home from './components/Home/Home';
import Navbar from './components/Navbar';
import Projects from './components/Projects/Projects';
import ScrollToTop from './components/ScrollToTop';
import UplodadFile from './components/UploadResume/uplodad';

function App() {
	const [load, upadateLoad] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			upadateLoad(false);
		}, 1200);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Router>
			<Preloader load={load} />
			<div className='App' id={load ? 'no-scroll' : 'scroll'}>
				<Navbar />
				<ScrollToTop />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/project' element={<Projects />} />
					<Route path='/about' element={<About />} />
					<Route path='/uploadFile' element={<UplodadFile />} />
					<Route path='*' element={<Navigate to='/' />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
