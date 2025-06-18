import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fileSaver from 'file-saver';

export const generateDocx = async ( templatePath, formData, fileName ) => {
	const response = await fetch( templatePath );
	const content  = await response.arrayBuffer();

	const zip = new PizZip( content );
	const doc = new Docxtemplater(
		zip,
		{
			paragraphLoop: true,
			linebreaks: true,
		}
	);

	doc.setData( {
		ime_prezime: formData.ime_prezime,
		ime_roditelja: formData.ime_roditelja,
		adresa: formData.adresa,
		email: formData.email,
	} );

	try {
		doc.render();
		const out = doc.getZip().generate( {
			type: 'blob',
			mimeType:
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		} );

		fileSaver.saveAs( out, fileName );
	} catch (error) {
		console.error(
			'Greška prilikom generisanja dokumenta: ',
			error
		);
	}
};