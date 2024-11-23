import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({ auth: { isAuthenticated, loading }, children }) => {
	if (loading) return null; // Optionally add a loading spinner here

	return isAuthenticated ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
	auth: PropTypes.shape({
		isAuthenticated: PropTypes.bool.isRequired,
		loading: PropTypes.bool.isRequired,
	}).isRequired,
	children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
