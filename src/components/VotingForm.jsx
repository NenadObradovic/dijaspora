import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import validator from 'validator';
import { JEDINSTVEN_BIRACKI_SPISAK_URL } from '../constants/global.js';

const VotingForm = ({ onSubmit }) => {
	const [activeTab, setActiveTab] = useState( 'check' );
	const [updateVoter, setUpdateVoter] = useState( false );
	const [data, setData] = useState( {
		full_name: '',
		parent_name: '',
		jmbg: '',
		address: '',
		address_abroad: '',
		country: 'Srbija',
		city: '',
		telephone: '',
		email: '',
		signature: '',
	} );

	const availableCountries = ['Srbija', 'USA'];
	const citiesByCountry = {
		Srbija: ['Belgrade', 'Novi Sad', 'Niš'],
		USA: ['Čikago', 'Njujork', 'Los Angeles'],
	};

	const [availableCities, setAvailableCities] = useState();


	const sigCanvasRef   = useRef( {} );
	const clearSignature = () => {
		sigCanvasRef.current.clear();
		setData( ( prev ) => ({ ...prev, signature: '' }) );
	};

	const saveSignature = () => {
		if ( ! sigCanvasRef.current.isEmpty() ) {
			const base64 = sigCanvasRef.current.getTrimmedCanvas().toDataURL( 'image/png' );
			setData( ( prev ) => ({ ...prev, signature: base64 }) );
		} else {
			alert( 'Molimo Vas da se potpišite pre slanja zahteva.' );
		}
	};

	const handleChange = ( e ) => {
		const { name, value } = e.target;
		setData( ( prev ) => ({
			...prev,
			[name]: value,
			...(name === 'country' ? { city: '' } : {}),
		}) );

		if ( name === 'country' ) {
			setAvailableCities( citiesByCountry[value] );
		}
	};

	const handleSubmit = ( e ) => {
		e.preventDefault();

		if ( ! data.signature ) {
			alert( 'Potpis je obavezan!' );
			setActiveTab( 'signature' );
			return;
		}

		if (
			validator.isLength(
				data.jmbg,
				{ min: 13, max: 13 }
			) &&
			validator.isNumeric( data.jmbg ) &&
			validator.isEmail( data.email )
		) {
			onSubmit( data, updateVoter );
		} else {
			alert( 'Neispravan unos.' );
		}
	};

	return (
		<div>
			<div className="tabs">
				<button onClick={() => setActiveTab('check')} className={activeTab === 'check' ? 'active' : ''}>Provera biračkog spiska</button>
				<button onClick={() => setActiveTab('personal-data')} className={activeTab === 'personal-data' ? 'active' : ''}>Lični podaci</button>
				<button onClick={() => setActiveTab('signature')} className={activeTab === 'signature' ? 'active' : ''}>Potpis i preuzimanje</button>
			</div>
			<form onSubmit={handleSubmit}>
				{activeTab === 'check' && (
					<>
						<div>
							<p>Proverite da li ste upisani u jedinstveni birački spisak klikom na dugme ispod i potom se vratite na ovu stranicu:</p>
							<a href={JEDINSTVEN_BIRACKI_SPISAK_URL} target="_blank">Jedinstveni birački spisak</a>
						</div>
						<div>
							<label form="generateVoter">Generiši zahtev za upis u birački spisak?</label>
							<input id="generateVoter" type="checkbox" checked={updateVoter} onChange={() => setUpdateVoter(!updateVoter)} />
						</div>
					</>
				)}
				{activeTab === 'personal-data' && (
					<>
						<div>
							<input
								type="text"
								name="full_name"
								placeholder="Ime i prezime"
								value={data.full_name}
								onChange={handleChange}
								required
							/>
							<span>Unesite puno ime kako je upisano u dokumentu</span>
						</div>
						<div>
							<input type="text" name="parent_name" placeholder="Ime roditelja" value={data.parent_name} onChange={handleChange} required />
							<span>Unesite ime jednog od roditelja</span>
						</div>
						<div>
							<input type="text" name="jmbg" placeholder="JMBG" value={data.jmbg} onChange={handleChange} min={13} max={13} required />
							<span>Unesite svoj jedinstveni matični broj građana</span>
						</div>
						<div>
							<input type="text" name="address" placeholder="Adresa prebivališta u R. Srbiji" value={data.address} onChange={handleChange} required />
							<span>Unesite adresu prebivališta iz dokumenta</span>
						</div>
						<div>
							<input type="text" name="address_abroad" placeholder="Adresa boravišta u inostranstvu" value={data.address_abroad} onChange={handleChange} required />
							<span>Unesite adresu na kojoj boravite u inostranstvu</span>
						</div>
						<div>
							<select name="country" value={data.country} onChange={handleChange} required>
								<option value="">Izaberi državu</option>
								{
									availableCountries.map(
										( countryName ) => (
											<option key={countryName} value={countryName}>{countryName}</option>
										)
									)
								}
							</select>
							<span>Izaberite državu iz koje ćete glasati</span>
						</div>
						{
							data.country && availableCities &&
							<>
								<div>
									<select name="city" value={data.city} onChange={handleChange} required>
										<option value="" disabled>Izaberi grad</option>
										{
											availableCities.map(
												( cityName ) => (
													<option key={cityName} value={cityName}>{cityName}</option>
												)
											)
										}
									</select>
									<span>Izaberite grad iz koga biste želeli da glasate</span>
								</div>
							</>
						}
						<div>
							<input type="tel" name="telephone" placeholder="+381691234567" value={data.telephone} onChange={handleChange} required />
							<span>Unesite svoj kontakt telefon</span>
						</div>
						<div>
							<input type="email" name="email" placeholder="marko.markovic@gmail.com" value={data.email} onChange={handleChange} required />
							<span>Unesite svoju email adresu</span>
						</div>
					</>
				)}
				{activeTab === 'signature' && (
					<>
						<div>
							<label>Potpis:</label>
							<br />
							<div style={{border: '1px solid', display: 'inline-flex'}}>
								<SignatureCanvas
									canvasProps={{ width: 400, height: 150, className: 'sigCanvas' }}
									ref={sigCanvasRef}
									onEnd={saveSignature}
								/>
							</div>
							<button type="button" onClick={clearSignature}>Obriši potpis</button>
						</div>
						<br />
						{
							data.signature &&
							<button type="submit">Generiši Zahtev</button>
						}
					</>
				)}
			</form>
		</div>
	);
};

export default VotingForm;