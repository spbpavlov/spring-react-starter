import {notificationShow} from "../app/notifications";

const initialState = {
    users: [],
    currentUser: {},
    isLoading: false
};

const USERS_LOAD = "load_users";
const USERS_LOADED = "loaded_users";
const USERS_LOAD_ERROR = "load_failed";

export function usersLoad() {
    return {
        types: [ USERS_LOAD, USERS_LOADED, USERS_LOAD_ERROR ],
        promise: (client) => {
            return client.get('/users/')
        }
    }
}

const USER_LOAD = "user_load";
const USER_LOADED = "user_loaded";
const USER_LOAD_ERROR = "user_load_error";

export const userLoad = (id) => {
    return {
        types: [ USER_LOAD, USER_LOADED, USER_LOAD_ERROR ],
        promise: (client) => {
            return client.get('/users/' + id)
        }
    }
};

const USER_SAVE = "user_save";
const USER_SAVED = "user_saved";
const USER_SAVE_ERROR = "user_save_error";

export function userSave(data) {
    return {
        types: [ USER_SAVE, USER_SAVED, USER_SAVE_ERROR ],
        promise: (client) => client.post('/users/', data),
        afterSuccess: (dispatch) => {
            dispatch(notificationShow("User saved"));
        }
    }
}

const USER_DELETE = "user_delete";
const USER_DELETED = "user_deleted";
const USER_DELETE_ERROR = "user_delete_error";

export function userDelete(id) {
    return {
        types: [USER_DELETE, USER_DELETED, USER_DELETE_ERROR],
        promise: (client) => client.delete('/users/' + id),
        afterSuccess: (dispatch) => dispatch(notificationShow("User deleted"))
    }
}

const users = (state = initialState, action) => {
    switch (action.type) {
        // --- load users
        case USERS_LOAD:
            return {
                ...state,
                isLoading: true,
                users: []
            };

        case USERS_LOADED:
            return {
                ...state,
                isLoading: false,
                users: action.data.data
            };

        // --- save user
        case USER_SAVE:
            return {
                ...state,
                isLoading: true
            };

        case USER_SAVED:
            const savedUser = action.data.data;
            return {
                ...state,
                isLoading: false,
                currentUser: savedUser,
                users: [...state.users].map(user => {
                    if (user.id === savedUser.id) {
                        return Object.assign(user, savedUser);
                    }
                    return user;
                })
            };

        // --- load user
        case USER_LOAD:
            return {
                ...state,
                isLoading: true,
                currentUser: {}
            };

        case USER_LOADED:
            return {
                ...state,
                isLoading: false,
                currentUser: action.data.data
            };

        // --- delete user
        case USER_DELETE:
            return {
                ...state,
                isLoading: true
            };

        case USER_DELETED:
            return {
                ...state,
                isLoading: false
            }

        default:
            return state;
    }
};

export default users;