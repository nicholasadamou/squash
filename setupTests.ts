import * as React from 'react';
import { randomUUID } from 'crypto';

import '@testing-library/jest-dom';

Object.defineProperty(global, 'crypto', {
	value: {
		randomUUID: () => randomUUID(),
	},
});

// Make React available globally for tests
global.React = React;
