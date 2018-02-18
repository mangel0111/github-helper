import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import * as githubActions from '../actions/githubActions';


const Panel = styled.div`
	display: block;
	padding: 50px 10%;
`;

const PanelTitle = styled.div`
	padding: 0 0 23px;

	h2 {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    	font-weight: 300;
		font-size: 22px;
		text-transform: uppercase;
		padding: 0;
		font-weight: 100;
		margin: 0;
		color: #414C59;
	}
	p {
		opacity: 0.6;
	}
`;

const PanelBody = styled.div`
	text-align: left;
	border-color: #dfe8f1;
	margin-bottom: 20px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    background-color: #fff;
	box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
	border: 1px solid #dfe8f1;

	div {
		padding: 15px 20px;
		position: relative;
		
		h3 {
			font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    		font-weight: 300;
			margin: 0 0 15px;
			padding: 0;
			text-transform: uppercase;
			font-size: 20px;
			opacity: 0.7;
		}
	}
`;

const PanelBox = styled.div`
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
`;

const Filters = styled(PanelBody)`
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;

	div {
		padding: 5px 20px;
		width: 230px;
	}
`;

const FilterBox = styled.div`
	margin: 10px;
	border: 1px solid #dfe8f1;

	.form-group {
		padding: 10px 0 !important;
	}

	.form-control {
		width: 200px;
	}
`;

const IssueItem = styled.li`
	border-radius: 3px;
	margin: 0 0 2px;
    padding: 10px;
    border-left-width: 3px;
    border-left-style: solid;
	background: #fcfcfc;
	border-color: ${props => props.state};
	display: flex;

	div {
		padding: 10px 20px;
	}

	h3 {
		word-break: break-word;
	}
`;

const DateFilter =styled.div`
	padding: 0 !important;

	p {
		width: 200px;
		margin-top: 10px;
		font-size: 15px;
		opacity: 0.7;
	}
`;

const Info = styled.div`
	padding: 0 !important;

	div {
		padding: 0 !important;
		display: flex;
		flex-wrap: wrap;

		div {
			margin-right: 15px;
		}
	}
`;

const Label = styled.span`
	display: inline;
	padding: .2em .6em .3em;
	font-size: 15px;
	font-weight: 700;
	line-height: 1;
	color: #fff;
	text-align: center;
	white-space: nowrap;
	vertical-align: baseline;
	border-radius: .25em;
	background-color: #${props => props.color};
	margin-right: 10px;
`;

const Avatar = styled.img`
	width: 204px;
	height: auto;
	border-radius: 6px;
	vertical-align: middle;
`;

const propTypes = {
	gitActions: PropTypes.object,
	issues: PropTypes.array
};

export class GitIssuesList extends Component {

	static getStateColor({ state }){
		switch(state){
		case 'open':
			return '#5bccf6';
		case 'closed':
			return '#ff5757';
		case 'all':
			return '#2ecc71';
		default: 
			return '#5bccf6';
		}
	}

	constructor(props){
		super(props);
		this.state= {
			owner: 'atom',
			repo:'atom',
			params: {
				stateOpen: true,
				stateClosed: false, 
				sort: 'created',
				direction: 'desc',
				since: null
			}
		};
	}

	createIssue(issue) {
		return (
			<IssueItem 
				key={ issue.id } 
				state={ GitIssuesList.getStateColor({ state: issue.state}) }
			>
				<div>
					<Avatar src={ issue.user.avatar_url } alt="user_profile"/>
				</div>
				<div>
					<h3>{issue.title}</h3>
					<Info>
						<div>
							<div>
								<label>User:</label> 
								<a 
									href={ issue.user.html_url }
									target="_blank"
								>{issue.user.login}</a>
							</div>
							<div>
								<label>State:</label> {issue.state}
							</div>
							<div>
								<label>Created ad:</label> {issue.created_at}
							</div>
							
						</div>
						<div>
							{issue.labels.map(label => {
								return (
									<Label
										color={ label.color }
										key={ label.id }
									>
										{label.name}
									</Label>);
							})}
						</div>
						<div>
							<a href={ issue.html_url } target="_blank"> Go to Issue </a>
						</div>
					</Info>
				</div>
			</IssueItem>);
	}

	componentWillMount() { 
		this.fetchIssues();
	}

	changeFilter({ type, value, isParam = true }){
		const state = this.state;
		if(isParam){
			state.params[type] = value;
		} else {
			state[type] = value;
		}
		this.setState(state);
		this.fetchIssues();
	}

	fetchIssues(){
		const { owner, repo, params } = this.state;
		this.props.gitActions.fetchIssues({ owner, repo, params });
	}
      
	render(){
		const { issues, owners } = this.props;
		const { owner, repo , params} = this.state;
		const ownerSelected = owners.find(owner => owner.key === this.state.owner);
		
		return (
			<Panel>
				<PanelTitle>
					<h2>
						Git Issues:
					</h2>
					<p>
						Here you can search for any github issue that you need!
					</p>
				</PanelTitle>
				<Filters>
					<FilterBox>
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Owner</ControlLabel>
							<FormControl 
								onChange={ e => {
									const value = e.target.value;
									const ownerToSelect = owners.find(owner => owner.key === value);
									this.changeFilter({ type: 'owner', value, isParam: false });
									this.changeFilter({ type: 'repo', value: ownerToSelect.repos[0].key,  isParam: false });
								} }
								componentClass="select" placeholder="Owner"
								value={ this.state.owner }
							>
								{
									owners.map(owner => 
										<option value={ owner.key } key={ owner.key }>{owner.label}</option> )
								}
							
							</FormControl>
						</FormGroup>
					</FilterBox>
					<FilterBox>
						<FormGroup controlId="formControlsSelect">
							<ControlLabel>Repo</ControlLabel>
							<FormControl 
								onChange={ e => this.changeFilter({ type: 'repo', value: e.target.value,  isParam: false }) }
								componentClass="select"
								placeholder="Repo"
							>
								{
									ownerSelected.repos
										.map(owner => 
											<option value={ owner.key } key={ owner.key }>{owner.label}</option> )
								}
							</FormControl>
						</FormGroup>
					</FilterBox>
					<FilterBox>
						States:
						<div className="checkbox">
							<label>
								<input 
									checked={ params.stateOpen }
									onChange={ e => this.changeFilter({ type: 'stateOpen', value: e.target.checked }) }
									type="checkbox" value=""
								/>
								Open
							</label>
						</div>
						<div className="checkbox">
							<label>
								<input 
									checked={ params.stateClosed }
									onChange={ e => this.changeFilter({ type: 'stateClosed', value: e.target.checked }) }
									type="checkbox" 
								/>
								Close
							</label>
						</div>
					</FilterBox>
					<FilterBox>
						Sort:
						<div className="radio">
							<label>
								<input
									checked={ params.sort === 'created' } 
									onChange={ e => this.changeFilter({ type: 'sort', value: e.target.value }) }
									type="radio" 
									name="sort" 
									value='created'
								/>
							Created</label>
						</div>
						<div className="radio">
							<label>
								<input 
									checked={ params.sort === 'updated' }
									onChange={ e => this.changeFilter({ type: 'sort', value: e.target.value }) } 
									type="radio" 
									name="sort" 
									value="updated"
								/>
								Updated</label>
						</div>
						<div className="radio">
							<label>
								<input 
									checked={ params.sort === 'comments' }
									onChange={ e => this.changeFilter({ type: 'sort', value: e.target.value }) }
									type="radio" 
									name="sort" 
									value="comments"
								/>
								Comments</label>
						</div>
					</FilterBox>
					<FilterBox>
						Direction:
						<div className="radio">
							<label>
								<input 
									checked={ params.direction === 'asc' }
									onChange={ e => this.changeFilter({ type: 'direction', value: e.target.value }) } 
									type="radio" 
									name="direction" 
									value="asc"
								/>Asc</label>
						</div>
						<div className="radio">
							<label>
								<input 
									checked={ params.direction === 'desc' }
									onChange={ e => this.changeFilter({ type: 'direction', value: e.target.value }) } 
									type="radio" 
									name="direction"
									value="desc"
								/>Desc</label>
						</div>
					</FilterBox>
					<FilterBox>
						Since:
						<DateFilter>
							<input 
								type='date' 
								className="form-control"
								onChange={ e=> this.changeFilter({ type: 'since', value: e.target.value }) }
							/>
							<p>
								Only issues updated at or after this time are returned. 
							</p>
						</DateFilter>
					</FilterBox>
				</Filters>
				<PanelBody>
					<div>
						<h3>
							Issues founded in the {repo} of {owner} 
						</h3>
						<PanelBox>
							<ul>
								{issues.map(issue => this.createIssue(issue) )}
							</ul>
						</PanelBox>
					</div>
				</PanelBody>
			</Panel>);
	}
}

const mapStateToProps = (state) => {
	return {
		issues: state.github.issues,
		owners: state.github.owners
	};
};
  
const mapDispatchToProps = (dispatch) => {
	return {
		gitActions: bindActionCreators(githubActions, dispatch)
	};
};

GitIssuesList.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(GitIssuesList);
