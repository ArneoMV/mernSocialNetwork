import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import RoutesComponent from "./components/routing/Routes"; // Make sure RoutesComponent is used here
import PrivateRoute from "./components/routing/PrivateRoute"; // This is fine, just keep it for your private routes

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import "./App.css";

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/*" element={<RoutesComponent />} />{" "}
						{/* Catch-all for all other routes */}
					</Routes>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
