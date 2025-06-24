import React from 'react';
import { useTranslation } from 'react-i18next';
import { EMAIL_BODY_NON_VOTER, EMAIL_BODY_VOTER } from '../constants/emailContants.js';

const EmailTemplate = ({ updateVoter }) => {
	const { t } = useTranslation();
	const body = updateVoter ? EMAIL_BODY_VOTER : EMAIL_BODY_NON_VOTER;

	return (
		<div>
			<h3>{t('email_heading_example')}</h3>
			<pre>{body}</pre>
		</div>
	);
};

export default EmailTemplate;
