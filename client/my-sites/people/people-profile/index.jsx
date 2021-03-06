/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import { get } from 'lodash';
import { recordTrack } from 'reader/stats';
import page from 'page';
import { decodeEntities } from 'lib/formatting';

/**
 * Internal dependencies
 */
import Gravatar from 'components/gravatar';

class PeopleProfile extends React.PureComponent {
	static displayName = 'PeopleProfile';

	getRole = () => {
		const { invite, user } = this.props;

		if ( invite && invite.role ) {
			return invite.role;
		}

		if ( ! user ) {
			return 'subscriber';
		}

		if ( user && user.roles && user.roles[ 0 ] ) {
			return user.roles[ 0 ];
		}

		return;
	};

	getRoleBadgeText = role => {
		let text;
		role = 'undefined' === typeof role ? this.getRole() : role;

		switch ( role ) {
			case 'super admin':
				text = this.props.translate( 'Super Admin', {
					context: 'Noun: A user role displayed in a badge',
				} );
				break;
			case 'administrator':
				text = this.props.translate( 'Admin', {
					context: 'Noun: A user role displayed in a badge',
				} );
				break;
			case 'editor':
				text = this.props.translate( 'Editor', {
					context: 'Noun: A user role displayed in a badge',
				} );
				break;
			case 'author':
				text = this.props.translate( 'Author', {
					context: 'Noun: A user role displayed in a badge',
				} );
				break;
			case 'contributor':
				text = this.props.translate( 'Contributor', {
					context: 'Noun: A user role displayed in a badge',
				} );
				break;
			case 'subscriber':
				text = this.props.translate( 'Subscriber', {
					context: 'Noun: A user role displayed in a badge',
				} );
				break;
			case 'follower':
				text = this.props.translate( 'Follower' );
				break;
			default:
				text = role;
		}

		return text;
	};

	getRoleBadgeClass = role => {
		role = 'undefined' === typeof role ? this.getRole() : role;
		return 'role-' + role;
	};

	handleLinkToReaderSiteStream = event => {
		const modifierPressed =
			event.button > 0 || event.metaKey || event.controlKey || event.shiftKey || event.altKey;

		recordTrack( 'calypso_sites_people_followers_link_click', {
			modifier_pressed: modifierPressed,
		} );

		if ( modifierPressed ) {
			return;
		}

		const blogId = get( this.props.user, 'follow_data.params.blog_id', false );

		if ( ! blogId ) {
			return;
		}

		event.preventDefault();
		page( `/read/blogs/${ blogId }` );
	};

	renderNameOrEmail = () => {
		const { translate, type, user } = this.props;

		let name;
		if ( ! user ) {
			name = translate( 'Loading Users', {
				context: 'Placeholder text while fetching users.',
			} );
		} else if ( user.name ) {
			name = user.name;
		} else if ( user.label ) {
			name = user.label;
		} else if ( 'invite' === type || 'invite-details' === type ) {
			// If an invite was sent to a WP.com user, the invite object will have
			// either a display name (if set) or the WP.com username. Invites can
			// also be sent to any email address, in which case the other details
			// will not be set and we therefore display the user's email.
			name = user.login || user.email;
		}

		const blogId = get( user, 'follow_data.params.blog_id', false );

		if ( name && blogId ) {
			name = (
				<div className="people-profile__username">
					<a href={ user.url } onClick={ this.handleLinkToReaderSiteStream }>
						{ decodeEntities( name ) }
					</a>
				</div>
			);
		} else if ( name ) {
			name = <div className="people-profile__username">{ decodeEntities( name ) }</div>;
		}
		return name;
	};

	renderLogin = () => {
		let login;
		if ( ! this.props.user ) {
			login = this.props.translate( 'Loading Users', {
				context: 'Placeholder text while fetching users.',
			} );
		} else if ( this.props.user.login ) {
			login = this.props.user.login;
		}

		if ( login ) {
			login = (
				<div className="people-profile__login">
					<span>@{ login }</span>
				</div>
			);
		}

		return login;
	};

	renderRole = () => {
		let superAdminBadge, roleBadge;

		if ( this.props.user && this.props.user.is_super_admin ) {
			superAdminBadge = (
				<div className="people-profile__role-badge role-super-admin">
					{ this.getRoleBadgeText( 'super admin' ) }
				</div>
			);
		}

		if ( this.getRole() ) {
			roleBadge = (
				<div className={ classNames( 'people-profile__role-badge', this.getRoleBadgeClass() ) }>
					{ this.getRoleBadgeText() }
				</div>
			);
		}

		if ( ! roleBadge && ! superAdminBadge ) {
			return;
		}

		return (
			<div className="people-profile__badges">
				{ superAdminBadge }
				{ roleBadge }
			</div>
		);
	};

	renderSubscribedDate = () => {
		if ( ! this.props.user || ! this.props.user.date_subscribed ) {
			return;
		}

		return (
			<div className="people-profile__subscribed">
				{ this.props.translate( 'Since %(formattedDate)s', {
					context: 'How long a user has been subscribed to a blog. Example: "Since Sep 16, 2015"',
					args: {
						formattedDate: this.props.moment( this.props.user.date_subscribed ).format( 'll' ),
					},
				} ) }
			</div>
		);
	};

	isFollowerType = () => {
		return this.props.user && ! this.props.user.roles && this.props.user.date_subscribed;
	};

	render() {
		const { user } = this.props;

		const classes = classNames( 'people-profile', {
			'is-placeholder': ! user,
		} );

		return (
			<div className={ classes }>
				<div className="people-profile__gravatar">
					<Gravatar user={ user } size={ 72 } />
				</div>
				<div className="people-profile__detail">
					{ this.renderNameOrEmail() }
					{ this.renderLogin() }
					{ this.isFollowerType() ? this.renderSubscribedDate() : this.renderRole() }
				</div>
			</div>
		);
	}
}

export default localize( PeopleProfile );
