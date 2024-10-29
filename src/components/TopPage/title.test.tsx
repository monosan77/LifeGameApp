import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Title from './title';

describe('titleコンポーネントのテスト', () => {
  it('タイトルが表示されているか', () => {
    render(<Title />);

    const text1 = screen.getByText('人');
    const text2 = screen.getByText('ム');

    expect(text1).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
  });
});
