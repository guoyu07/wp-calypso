/**
 * External Dependencies
 *
 * @format
 */

/**
 * Internal Dependencies
 */
import { mergeHandlers } from 'state/action-watchers/utils';
import newLike from './new';
import mine from './mine';
import { POST_LIKES_REQUEST } from 'state/action-types';
import { dispatchRequestEx } from 'state/data-layer/wpcom-http/utils';

export default mergeHandlers( newLike, mine, {
	[ POST_LIKES_REQUEST ]: [ dispatchRequestEx( {} ) ],
} );
