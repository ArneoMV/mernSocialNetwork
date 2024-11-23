import axios from "axios";
import { setAlert } from "./alert";
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_PROFILE,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async (dispatch) => {
	// Set token in headers if available
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	} else {
		console.warn("No token found in localStorage.");
	}

	try {
		// Request current user data
		const res = await axios.get("/api/auth");

		dispatch({
			type: USER_LOADED,
			payload: res.data, // User data from the backend
		});
	} catch (err) {
		console.error(
			"Error loading user:",
			err.response?.data?.msg || err.message
		);
		dispatch({
			type: AUTH_ERROR, // Reset auth state
		});
	}
};

// Register User
export const register =
	({ name, email, password }) =>
	async (dispatch) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const body = JSON.stringify({ name, email, password });

		try {
			// Register new user
			const res = await axios.post("/api/users", body, config);

			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data, // Token received
			});

			dispatch(loadUser()); // Load user after successful registration
		} catch (err) {
			// Handle validation errors from the backend
			const errors = err.response?.data?.errors;

			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
			}

			console.error(
				"Registration error:",
				err.response?.data?.msg || err.message
			);
			dispatch({
				type: REGISTER_FAIL,
			});
		}
	};

// Login User
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	const body = JSON.stringify({ email, password });

	try {
		// Authenticate user
		const res = await axios.post("/api/auth", body, config);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data, // Token received
		});

		dispatch(loadUser()); // Load user after successful login
	} catch (err) {
		// Handle login errors
		const errors = err.response?.data?.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
		}

		console.error("Login error:", err.response?.data?.msg || err.message);
		dispatch({
			type: LOGIN_FAIL,
		});
	}
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
	console.info("User logged out. Clearing profile and resetting auth state.");
	dispatch({ type: CLEAR_PROFILE });
	dispatch({ type: LOGOUT });
};
