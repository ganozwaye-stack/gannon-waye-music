const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;
const storageApi = /** @type {any} */ (storage);
const DEFAULT_BASE44_APP_ID = '69eb7905ca6eb4180010f794';
const DEFAULT_APP_BASE_URL = 'https://gannonwaye.com';

const getStorageValue = (key) => (typeof storageApi.getItem === 'function' ? storageApi.getItem(key) : storageApi.get(key));
const setStorageValue = (key, value) => (typeof storageApi.setItem === 'function' ? storageApi.setItem(key, value) : storageApi.set(key, value));
const removeStorageValue = (key) => (typeof storageApi.removeItem === 'function' ? storageApi.removeItem(key) : storageApi.delete(key));

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		setStorageValue(storageKey, searchParam);
		return searchParam;
	}
	if (defaultValue) {
		setStorageValue(storageKey, defaultValue);
		return defaultValue;
	}
	const storedValue = getStorageValue(storageKey);
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		removeStorageValue('base44_access_token');
		removeStorageValue('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID || DEFAULT_BASE44_APP_ID }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL || DEFAULT_APP_BASE_URL }),
	}
}


export const appParams = {
	...getAppParams()
}
