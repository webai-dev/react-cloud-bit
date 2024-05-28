import * as TYPES from "./_types";

const INITIAL_STATE = {
	list: []
};

export default function(state = INITIAL_STATE, action) {
	switch (action.type) {

		case TYPES.FETCH_INVITATIONS:
		case TYPES.FETCH_INVITATIONS_ERROR:
			return { ...state, list: [] };
		case TYPES.FETCH_INVITATIONS_SUCCESS:
			return { ...state, list: [...state.list, ...action.payload] };

		case TYPES.UPDATE_INVITATION:
		case TYPES.UPDATE_INVITATION_ERROR:
			return state;
		case TYPES.UPDATE_INVITATION_SUCCESS:
			const handled_invitation = action.payload.id;
			const invitations = state.list.filter(x => x.id !== handled_invitation);
			return { ...state, list: invitations };

		default:
			return state;
	}
}
