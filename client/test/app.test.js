import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './app';

test('renders index page', () => {
    render(<App />);
    expect(screen.getByText('bloghouse')).toBeInTheDocument();
});
