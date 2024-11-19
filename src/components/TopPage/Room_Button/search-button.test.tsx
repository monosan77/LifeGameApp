import '@testing-library/dom';
import { fireEvent, render, screen } from '@testing-library/react';
import SearchButton from './search-button';

interface Props {
  closeChanger: () => void;
  findPop: boolean;
  player: string;
}

jest.mock('./Search_Popup_Button/search-popup', () => {
  return function MockSearchMock({ closeChanger, findPop, player }: Props) {
    return (
      <div data-testid="mock-search-popup">
        {findPop && (
          <>
            <p>{`モックされたコンポーネント: ${player}`}</p>
            <button onClick={closeChanger}>モックの閉じる</button>
          </>
        )}
      </div>
    );
  };
});

describe('search-buttonコンポーネントのテスト', () => {
  test('searchPopupコンポーネントが初期状態で表示されていないこと', () => {
    render(<SearchButton playerName="山田" />);

    expect(screen.queryByText('モックを閉じる')).not.toBeInTheDocument();
  });

  test('buttonを押すとsearchPopupコンポーネントが表示されるのか', () => {
    render(<SearchButton playerName="山田" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByTestId('mock-search-popup')).toHaveStyle(
      'display: block'
    );
  });
});
