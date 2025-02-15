import { render, screen, fireEvent } from '@testing-library/react';

import { CompressionOptions } from '../../components/CompressionOptions';
import type { OutputType } from '../../types';

describe('CompressionOptions', () => {
	const mockOnOptionsChange = jest.fn();
	const mockOnOutputTypeChange = jest.fn();

	const defaultProps = {
		options: { quality: 80 },
		outputType: 'jpeg' as OutputType,
		onOptionsChange: mockOnOptionsChange,
		onOutputTypeChange: mockOnOutputTypeChange,
	};

	it('renders the OutputFormatSelector and QualitySelector', () => {
		render(<CompressionOptions {...defaultProps} />);

		expect(screen.getByText('Output Format')).toHaveTextContent('Output Format');
		expect(screen.getByText('Quality: 80%').textContent).toBe('Quality: 80%');
	});

	it('does not render QualitySelector when outputType is png', () => {
		render(<CompressionOptions {...defaultProps} outputType="png" />);

		expect(screen.queryByText('Quality: 80%')).not.toBe('Quality: 80%');
	});

	it('calls onOutputTypeChange when format is changed', () => {
		render(<CompressionOptions {...defaultProps} />);

		const webpButton = screen.getByText('webp');
		fireEvent.click(webpButton);

		expect(mockOnOutputTypeChange).toHaveBeenCalledWith('webp');
	});

	it('calls onOptionsChange when quality is changed', () => {
		render(<CompressionOptions {...defaultProps} />);

		const qualityInput = screen.getByRole('slider');
		fireEvent.change(qualityInput, { target: { value: '50' } });

		expect(mockOnOptionsChange).toHaveBeenCalledWith({ quality: 50 });
	});
});
