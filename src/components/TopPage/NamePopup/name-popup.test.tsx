import '@testing-library/dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NamePopup from './name-popup';

const props = {
  playerName: '',
  setPlayerName: jest.fn(),
  setShowLinks: jest.fn(),
  setConformName: jest.fn(),
  namePopUp: true,
  setIsNamePopUp: jest.fn(),
};

describe('name-popupコンポーネントのテスト', () => {
  test('初期状態でrenameがtrue', () => {
    render(<NamePopup {...props} />);
    const inputElement = screen.getByPlaceholderText(
      'ユーザー名を入力してください(5文字まで)'
    );
    expect(inputElement).toBeInTheDocument();
  });

  test('ユーザー名入力が反映される', () => {
    render(<NamePopup {...props} />);
    const input = screen.getByPlaceholderText(
      'ユーザー名を入力してください(5文字まで)'
    );
    fireEvent.change(input, { target: { value: 'aaa' } });
    expect(props.setPlayerName).toHaveBeenCalledWith('aaa');
  });

  test('ユーザー名が未入力だった場合にエラーが出る', () => {
    render(<NamePopup {...props} />);
    fireEvent.click(screen.getByText('OK'));
    expect(
      screen.getByText('ユーザー名が入力されていません。')
    ).toBeInTheDocument();
  });

  test('初期状態でcreateNameがtrue', () => {
    render(<NamePopup {...props} />);
    const text = screen.getByText('名前を決めよう！');
    expect(text).toBeInTheDocument();
  });

  test('OKボタンを押すと、createNameがfalseになり、確定ボタンが表示される', async () => {
    const setPlayerName = jest.fn();
    const setShowLinks = jest.fn();
    const setConformName = jest.fn();
    const setIsNamePopUp = jest.fn();

    render(
      <NamePopup
        playerName="テストユーザー"
        setPlayerName={setPlayerName}
        setShowLinks={setShowLinks}
        setConformName={setConformName}
        namePopUp={true}
        setIsNamePopUp={setIsNamePopUp}
      />
    );
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => screen.getByRole('button', { name: /確定/i }));
    expect(screen.getByRole('button', { name: /確定/i })).toBeInTheDocument();
  });

  test('確定ボタンを押すと、createNameがfalseになり、非表示になる', async () => {
    const setPlayerName = jest.fn();
    const setShowLinks = jest.fn();
    const setConformName = jest.fn();
    const setIsNamePopUp = jest.fn();

    render(
      <NamePopup
        playerName="テストユーザー"
        setPlayerName={setPlayerName}
        setShowLinks={setShowLinks}
        setConformName={setConformName}
        namePopUp={false}
        setIsNamePopUp={setIsNamePopUp}
      />
    );

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => screen.getByRole('button', { name: /確定/i }));

    fireEvent.click(screen.getByRole('button', { name: /確定/i }));

    expect(screen.queryByRole('button', { name: /OK/i })).toBeInTheDocument();
  });

  test('戻るボタンを押すと、renameがtrueに戻る', async () => {
    const setPlayerName = jest.fn();
    const setShowLinks = jest.fn();
    const setConformName = jest.fn();
    const setIsNamePopUp = jest.fn();

    render(
      <NamePopup
        playerName="テストユーザー"
        setPlayerName={setPlayerName}
        setShowLinks={setShowLinks}
        setConformName={setConformName}
        namePopUp={false}
        setIsNamePopUp={setIsNamePopUp}
      />
    );

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => screen.getByRole('button', { name: /戻る/i }));

    fireEvent.click(screen.getByRole('button', { name: /戻る/i }));

    expect(screen.getByRole('button', { name: /OK/i })).toBeInTheDocument();
  });
});
