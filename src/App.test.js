import { render, screen } from '@testing-library/react';
import App from './App';

// axios ships ESM that CRA's Jest cannot transform, and App fetches on mount.
// Mock it so the suite runs without a real network call.
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

// react-gauge-chart pulls in d3 (ESM), which CRA's Jest cannot transform.
jest.mock('react-gauge-chart', () => () => <div data-testid="gauge" />);

test('renders the search form', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
});
