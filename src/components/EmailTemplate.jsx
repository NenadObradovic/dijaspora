import React from 'react';
import { EMAIL_BODY_NON_VOTER, EMAIL_BODY_VOTER } from '../constants/emailContants.js';

const EmailTemplate = ({ formData, updateVoter }) => {
	const body    = updateVoter ? EMAIL_BODY_VOTER : EMAIL_BODY_NON_VOTER;

	return (
		<div>
			<h3>Predloženi tekst mejla:</h3>
			<pre>{body}</pre>
		</div>
	);
};

export default EmailTemplate;