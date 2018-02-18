import React, { Component } from 'react';
import logo from './github-sociocon.png';
import './App.css';
import GitIssuesList from './containers/GitIssuesList';

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={ logo } className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to Github Helper</h1>
				</header>
				<div className="App-intro">
					<GitIssuesList />
				</div>
			</div>
		);
	}
}

export default App;
