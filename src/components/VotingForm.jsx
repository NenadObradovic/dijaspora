import React, { useState } from 'react';
import validator from 'validator';

const VotingForm = ({ onSubmit }) => {
	const [data, setData] = useState({
		ime_prezime: '',
		ime_roditelja: '',
		jmbg: '',
		email: '',
		adresa: ''
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			validator.isLength(data.jmbg, { min: 13, max: 13 }) &&
			validator.isNumeric(data.jmbg) &&
			validator.isEmail(data.email)
		) {
			onSubmit(data);
		} else {
			alert("Neispravan unos.");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input type="text" name="ime_prezime" placeholder="Ime i Prezime" onChange={handleChange} required />
			<input type="text" name="ime_roditelja" placeholder="ime jednog roditelja" onChange={handleChange} required />
			<input type="text" name="jmbg" placeholder="JMBG" onChange={handleChange} required />
			<input type="email" name="email" placeholder="Email" onChange={handleChange} required />
			<input type="text" name="adresa" placeholder="Adresa boravka u inostranstvu" onChange={handleChange} required />
			<button type="submit">Generiši Zahtev</button>
		</form>
	);
};

export default VotingForm;