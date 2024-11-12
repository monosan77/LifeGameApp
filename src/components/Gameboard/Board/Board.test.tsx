import { render, screen } from '@testing-library/react';
import Board from './Board';

describe('Boardコンポーネントのテスト', () => {
  jest.mock('./ErrorMessage/ErrorMessage', () => {
    return <div data-testid="mocked-child">Mocked ErrorMessage Component</div>;
  });
  const position = [1, 1, 1, 1, 1];
  it('「STAET」「GOAL」が正しく表示されているか', () => {
    render(
      <Board
        playerPositions={position}
        isErrorAnimation={false}
        errorMessage={'error message'}
      />
    );
    const START = screen.getByText('START');
    const GOAL = screen.getByText('GOAL');
    expect(START).toBeInTheDocument();
    expect(GOAL).toBeInTheDocument();
  });

  it('1~50までのマスがあるか確認', () => {
    render(
      <Board
        playerPositions={position}
        isErrorAnimation={false}
        errorMessage={'error message'}
      />
    );
    for (let i = 1; i <= 50; i++) {
      const number = screen.getByText(i);
      expect(number).toBeInTheDocument();
    }
  });
});
