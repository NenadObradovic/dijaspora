import validator from 'validator';

export const validateForm = ( data ) => {
	const newErrors = {};

	if ( ! data.full_name.trim() ) {
		newErrors.full_name = 'Puno ime je obavezno.';
	}

	if ( ! data.parent_name.trim() ) {
		newErrors.parent_name = 'Ime jednog od roditelja je obavezno.';
	}

	if ( ! data.jmbg.trim() ) {
		newErrors.jmbg = 'JMBG je obavezan.';
	} else if ( ! validator.isNumeric( data.jmbg ) ) {
		newErrors.jmbg = 'JMBG mora sadržati samo brojeve.';
	} else if ( data.jmbg.length !== 13 ) {
		newErrors.jmbg = 'JMBG mora sadržati tačno 13 cifara.';
	}

	if ( ! data.address.trim() ) {
		newErrors.address = 'Adresa u Srbiji je obavezna.';
	}

	if ( ! data.address_abroad.trim() ) {
		newErrors.address_abroad = 'Adresa u inostranstvu je obavezna.';
	}

	if ( ! data.country ) {
		newErrors.country = 'Država je obavezna.';
	}

	if ( ! data.city ) {
		newErrors.city = 'Grad je obavezan.';
	}

	if ( ! data.telephone.trim() ) {
		newErrors.telephone = 'Telefon je obavezan.';
	}

	if ( ! validator.isEmail( data.email ) ) {
		newErrors.email = 'Email adresa nije ispravna.';
	}

	if ( ! data.signature ) {
		newErrors.signature = 'Potpis je obavezan.';
	}

	return Object.keys( newErrors ).length === 0;
};
