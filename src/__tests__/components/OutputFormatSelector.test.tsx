import { render, screen, fireEvent } from '@testing-library/react';
import { OutputFormatSelector } from '../../components/CompressionOptions';
import type { OutputType } from '../../types';

describe('OutputFormatSelector', () => {
	const mockOnFormatChange = jest.fn();

	const defaultProps = {
		selectedFormat: 'jpeg' as OutputType,
		onFormatChange: mockOnFormatChange,
	};

	it('renders all format buttons', () => {
		render(<OutputFormatSelector {...defaultProps} />);

		expect(screen.getByText('avif')).toHaveTextContent('avif');
		expect(screen.getByText('jpeg')).toHaveTextContent('jpeg');
		expect(screen.getByText('jxl')).toHaveTextContent('jxl');
		expect(screen.getByText('png')).toHaveTextContent('png');
		expect(screen.getByText('webp')).toHaveTextContent('webp');
	});

	it('calls onFormatChange when a format button is clicked', () => {
		render(<OutputFormatSelector {...defaultProps} />);

		const webpButton = screen.getByText('webp');
		fireEvent.click(webpButton);

		expect(mockOnFormatChange).toHaveBeenCalledWith('webp');
	});

	it('applies the correct styles to the selected format button', () => {
		render(<OutputFormatSelector {...defaultProps} selectedFormat="webp" />);

		const webpButton = screen.getByText('webp');
		expect(webpButton).toHaveClass('bg-blue-500 text-white');
	});
});
