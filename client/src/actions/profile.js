import axios from "axios";
import { setAlert } from "./alert";
import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_ERROR,
	UPDATE_PROFILE,
	CLEAR_PROFILE,
	ACCOUNT_DELETED,
	GET_REPOS,
} from "./types";

// Helper: Handle API errors
const handleError = (err, dispatch) => {
	const errorMsg = err.response?.statusText || "Server Error";
	const errorStatus = err.response?.status || 500;

	dispatch({
		type: PROFILE_ERROR,
		payload: { msg: errorMsg, status: errorStatus },
	});

	const errors = err.response?.data?.errors;
	if (errors) {
		errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
	}
};

// Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get("/api/profile/me");

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		handleError(err, dispatch);

		dispatch({ type: CLEAR_PROFILE });

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });

	try {
		const res = await axios.get("/api/profile");

		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		});
	} catch (err) {
		handleError(err, dispatch);
	}
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/user/${userId}`);

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		handleError(err, dispatch);
	}
};

// Get github repos
export const getGithubRepos = (username) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/github/${username}`);

		dispatch({
			type: GET_REPOS,
			payload: res.data, // This should be the repos data from the API
		});
	} catch (err) {
		console.error(err); // Log error for debugging
		handleError(err, dispatch);
	}
};

// Create or update profile
export const createProfile =
	(formData, navigate, edit = false) =>
	async (dispatch) => {
		try {
			const config = {
				headers: { "Content-Type": "application/json" },
			};

			const res = await axios.post("/api/profile", formData, config);

			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			});

			dispatch(
				setAlert(edit ? "Profile Updated" : "Profile Created", "success")
			);

			if (!edit) navigate("/dashboard");
		} catch (err) {
			handleError(err, dispatch);
		}
	};

// Add experience
export const addExperience = (formData, navigate) => async (dispatch) => {
	try {
		const config = {
			headers: { "Content-Type": "application/json" },
		};

		const res = await axios.put("/api/profile/experience", formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert("Experience Added", "success"));
		navigate("/dashboard");
	} catch (err) {
		handleError(err, dispatch);
	}
};

// Add education
export const addEducation = (formData, navigate) => async (dispatch) => {
	try {
		const config = {
			headers: { "Content-Type": "application/json" },
		};

		const res = await axios.put("/api/profile/education", formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert("Education Added", "success"));
		navigate("/dashboard");
	} catch (err) {
		handleError(err, dispatch);
	}
};

// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert("Experience Removed", "success"));
	} catch (err) {
		handleError(err, dispatch);
	}
};

// Delete education
export const deleteEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert("Education Removed", "success"));
	} catch (err) {
		handleError(err, dispatch);
	}
};

// Delete account & profile
export const deleteAccount = () => async (dispatch) => {
	if (window.confirm("Are you sure? This can NOT be undone!")) {
		try {
			await axios.delete("/api/profile");

			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: ACCOUNT_DELETED });

			dispatch(
				setAlert("Your account has been permanently deleted!", "success")
			);
		} catch (err) {
			handleError(err, dispatch);
		}
	}
};
