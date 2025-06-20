import React, { useState } from 'react';
import VotingForm from './VotingForm.jsx';
import EmailTemplate from './EmailTemplate.jsx';
import { generateDocx } from '../utils/generateDocx.js';
import { EMAIL_SUBJECT, EMAIL_BODY_VOTER, EMAIL_BODY_NON_VOTER } from '../constants/emailContants.js';

const App = () => {
	const [formData, setFormData]         = useState( null );
	const [updateVoter, setUpdateVoter]   = useState( false );
	const [docGenerated, setDocGenerated] = useState( false );

	const handleFormSubmit = async ( data, isUpdateVoter ) => {
		setFormData( data );
		setUpdateVoter( isUpdateVoter );

		if ( updateVoter ) {
			await Promise.all( [
				generateDocx(
					'/docs/zahtev-za-glasanje.docx',
					data,
					'Zahtev_za_glasanje_u_inostranstvu.docx'
				),
				generateDocx(
					'/docs/zahtev-za-upis.docx',
					data,
					'Zahtev_za_upis_u_jedinstveni_biracki_spisak.docx'
				),
			] );
		} else {
			await generateDocx(
				'/docs/zahtev-za-glasanje.docx',
				data,
				'Zahtev-za-glasanje-u-inostranstvu.docx'
			);
		}

		setDocGenerated( true );
	};

	const handleSendEmail = () => {
		if ( ! formData || typeof formData?.email === 'undefined' ) {
			return;
		}

		const email   = formData?.email || '';
		const subject = EMAIL_SUBJECT;
		const body    = updateVoter ? EMAIL_BODY_VOTER : EMAIL_BODY_NON_VOTER;

		window.location.href = `mailto:${email}?subject=${encodeURIComponent( subject )}&body=${encodeURIComponent( body )}`;
	};

	return (
		<>
			<h1>Glasanje iz inostranstva</h1>
			<VotingForm onSubmit={handleFormSubmit}/>
			{docGenerated && (
				<>
					<EmailTemplate updateVoter={updateVoter}/>
					<button onClick={handleSendEmail}>Pošalji mejl ambasadi</button>
				</>
			)}
		</>
	);
};

export default App;