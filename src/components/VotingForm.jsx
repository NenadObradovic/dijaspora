import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import validator from 'validator';

const VotingForm = ({ onSubmit }) => {
	const sigCanvasRef    = useRef( {} );
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

	const citiesByCountry = {
		Srbija: ['Belgrade', 'Novi Sad', 'Niš'],
		USA: ['Čikago', 'Njujork', 'Los Angeles'],
	};

	const [availableCities, setAvailableCities] = useState( citiesByCountry['Srbija'] );

	const clearSignature = () => {
		sigCanvasRef.current.clear();
		setData((prev) => ({ ...prev, signature: '' }));
	};

	const saveSignature = () => {
		if ( ! sigCanvasRef.current.isEmpty() ) {
			const base64 = sigCanvasRef.current.getTrimmedCanvas().toDataURL( 'image/png' );
			setData((prev) => ({ ...prev, signature: base64 }));
		} else {
			alert('Molimo potpišite se pre slanja.');
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
			onSubmit( data );
		} else {
			alert( 'Neispravan unos.' );
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" name="full_name" placeholder="Ime i prezime" value={data.full_name} onChange={handleChange} required />
			<input type="text" name="parent_name" placeholder="Ime jednog roditelja" value={data.parent_name} onChange={handleChange} required />
			<input type="text" name="jmbg" placeholder="JMBG" value={data.jmbg} onChange={handleChange} required />
			<input type="text" name="address" placeholder="Adresa prebivališta u R. Srbiji" value={data.address} onChange={handleChange} required />
			<input type="text" name="address_abroad" placeholder="Adresa boravišta u inostranstvu" value={data.address_abroad} onChange={handleChange} required />
			<select name="country" value={data.country} onChange={handleChange} required>
				<option value="Srbija">Srbija</option>
				<option value="USA">USA</option>
			</select>
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
			<input type="tel" name="telephone" placeholder="Telefon" value={data.telephone} onChange={handleChange} required />
			<input type="email" name="email" placeholder="Email" value={data.email} onChange={handleChange} required />
			<br />
			<label>Potpis:</label>
			<div style={{border: '1px solid'}}>
				<SignatureCanvas
					canvasProps={{ width: 400, height: 150, className: 'sigCanvas' }}
					ref={sigCanvasRef}
					onEnd={saveSignature}
				/>
			</div>
			<button type="button" onClick={clearSignature}>Obriši potpis</button>

			<button type="submit">Generiši Zahtev</button>
		</form>
	);
};

export default VotingForm;