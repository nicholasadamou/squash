import { render, screen, fireEvent } from '@testing-library/react';

import { DownloadAll } from '../../components/DownloadAll';

describe('DownloadAll', () => {
	test('renders the button with correct label for multiple images', () => {
		render(<DownloadAll onDownloadAll={jest.fn()} count={5} />);

		const button = screen.getByRole('button', { name: 'Download All (5 images)' });

		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Download All (5 images)');
	});

	test('renders the button with correct label for a single image', () => {
		render(<DownloadAll onDownloadAll={jest.fn()} count={1} />);

		const button = screen.getByRole('button', { name: 'Download All (1 image)' });

		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Download All (1 image)');
	});

	test('calls onDownloadAll when button is clicked', () => {
		const onDownloadAllMock = jest.fn();
		render(<DownloadAll onDownloadAll={onDownloadAllMock} count={3} />);

		const button = screen.getByRole('button', { name: 'Download All (3 images)' });

		fireEvent.click(button);

		expect(onDownloadAllMock).toHaveBeenCalledTimes(1);
	});

	test('button has the correct class names for styling', () => {
		render(<DownloadAll onDownloadAll={jest.fn()} count={2} />);

		const button = screen.getByRole('button', { name: 'Download All (2 images)' });

		expect(button).toHaveClass(
			'w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
		);
	});
});
