/**
 * External dependencies
 */
import React, { FunctionComponent, useState } from 'react';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import DocumentHead from 'components/data/document-head';

/**
 * WordPress dependencies
 */
import {
	BlockEditorProvider,
	BlockList,
	ObserveTyping,
	WritingFlow,
} from '@wordpress/block-editor';
import { registerCoreBlocks } from '@wordpress/block-library';
import type { BlockInstance } from '@wordpress/blocks';

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/editor.css';
import '@wordpress/block-library/build-style/theme.css';

registerCoreBlocks();

export const BlockPlayground: FunctionComponent = () => {
	const [ blocks, setBlocks ] = useState< BlockInstance[] >( [] );

	return (
		<Main className="devdocs block-playground">
			<DocumentHead title="Block Playground" />
			<div>
				<BlockEditorProvider value={ blocks } onInput={ setBlocks } onChange={ setBlocks }>
					<WritingFlow>
						<ObserveTyping>
							<BlockList />
						</ObserveTyping>
					</WritingFlow>
				</BlockEditorProvider>
			</div>
		</Main>
	);
};

export default BlockPlayground;
