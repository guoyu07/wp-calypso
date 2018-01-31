/** @format */

/**
 * External Dependencies
 */

/**
 * Internal Dependencies
 */
import { dispatchRequestEx } from 'state/data-layer/wpcom-http/utils';
import { POST_LIKE } from 'state/action-types';

export default {
	[ POST_LIKE ]: [ dispatchRequestEx( {} ) ],
};
