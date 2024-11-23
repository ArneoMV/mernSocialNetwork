import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
	experience: { company, title, location, current, to, from, description },
}) => {
	return (
		<div className="profile-exp p-2">
			<div>
				<h3 className="text-dark">{company}</h3>
				<p>
					<Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
					{!to ? " Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
				</p>
				<p>
					<strong>Position: </strong>
					{title}
				</p>
				<p>
					<strong>Description: </strong>
					{description}
				</p>
			</div>
		</div>
	);
};

ProfileExperience.propTypes = {
	experience: PropTypes.shape({
		company: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		location: PropTypes.string,
		current: PropTypes.bool.isRequired,
		to: PropTypes.string,
		from: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default ProfileExperience;
