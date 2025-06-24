import { useEffect } from 'react';
import i18n from '../utils/i18n';

const I18nRouterProvider = () => {
	useEffect(() => {
		const pathname = window.location.pathname;

		if (pathname.startsWith('/sr-cyrl')) {
			i18n.changeLanguage('sr-Cyrl');
		} else if (pathname.startsWith('/en')) {
			i18n.changeLanguage('en');
		} else {
			i18n.changeLanguage('sr-Latn');
		}
	}, []);

	return null;
};

export default I18nRouterProvider;
