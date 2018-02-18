import * as types from './actionTypes';

const BASE_URL = 'https://api.github.com/repos';
const ACCESS_TOKEN = '259179ac4ceb7bbbaf2177904af700607fd7c8bd';

const getState = ({ params, key }) => {
	if(params.stateOpen && params.stateClosed) {
		if(key === 'stateClosed') {
			return '';
		}
		return '&state=all';
	}
	return `&state=${key.slice(5).toLowerCase()}`;
};

const formatQueryParams = (params = {})=> {
	let queries = `access_token=${ACCESS_TOKEN}`;
	Object.keys(params)
		.filter(key => !!params[key])
		.forEach(key => {
			switch(key) {
			case 'stateOpen':
			case 'stateClosed':
				queries += getState({ params, key });
				break;
			default:
				queries += `&${key}=${params[key]}`;
				break;
			}	
		});
	return queries;
};

const getUrl = ({ owner, repo, params })  => {
	const queryParams = formatQueryParams(params);
	return `${BASE_URL}/${owner}/${repo}/issues?${queryParams}`;
};



export function receiveIssues(response) {
	return {type: types.RECEIVE_ISSUES, issues: response};
}

export function fetchIssues(params) {
	return dispatch => {
		return fetch(getUrl(params), {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin',
			headers: {
				'Accept': 'application/json'
			}
		})
			.then(response => response.json())
			.then(json => {
				let response = [];
				if(!json.message){
					
					response = json;
				} else {
					console.error(json.message);
				}
				dispatch(receiveIssues(response));
			})
			.catch(error => {
				console.error(error);
			});
	};
}
