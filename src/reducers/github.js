import initialState from './initialState';
import { FETCH_ISSUES, RECEIVE_ISSUES } from '../actions/actionTypes';

export default function github(state = initialState.github, action) {
	switch (action.type) {
	case FETCH_ISSUES:
		return action;
	case RECEIVE_ISSUES:
		return Object.assign({}, state, { issues: action.issues });
	default:
		return state;
	}
}
