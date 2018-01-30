/** @format */

const types = require( 'babel-types' );

module.exports = function() {
	return {
		visitor: {
			ImportDeclaration( path ) {
				const source = path.node.source;
				const subMatch = source.value.match( /^lodash-es\/(.*)/ );
				if ( subMatch ) {
					const localIdentifier = path.node.specifiers[ 0 ].local;
					const importedIdentifier = types.identifier( subMatch[ 1 ] );
					const specifier = types.importSpecifier( localIdentifier, importedIdentifier );
					const declaration = types.importDeclaration(
						[ specifier ],
						types.stringLiteral( 'lodash' )
					);
					path.replaceWith( declaration );
				}
			},
		},
	};
};
