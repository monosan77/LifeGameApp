import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './index';

jest.mock('../components/TopPage/Room_Button/room-button', () => {
  return jest.fn(() => <div>Mocked RoomButton</div>);
});

describe('Homeコンポーネントのテスト', () => {
  test('Homeコンポーネントが正しくレンダリングされる', () => {
    render(<Home />);
    expect(screen.getByText('人')).toBeInTheDocument();
  });

  test('NamePopupが表示されるかどうか', () => {
    render(<Home />);
    expect(screen.getByText('名前を決めよう！')).toBeInTheDocument();
  });

  test('RoomButtonがリンクが表示されたときにレンダリングされる', () => {
    render(<Home />);
    const roomButton = screen.queryByText('Mocked RoomButton');
    expect(roomButton).toBeInTheDocument();
  });

  test('playerNameが設定された後にRoomButtonが表示されるか', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(
      'ユーザー名を入力してください(5文字まで)'
    );
    fireEvent.change(input, { target: { value: 'John Doe' } });

    fireEvent.click(screen.getByText('OK'));

    expect(screen.getByText('Mocked RoomButton')).toBeInTheDocument();
  });

  test('名前が設定された後にNamePopupが非表示になるか', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(
      'ユーザー名を入力してください(5文字まで)'
    );
    fireEvent.change(input, { target: { value: 'aaa' } });
    fireEvent.click(screen.getByText('OK'));

    expect(screen.queryByText('名前を決めよう！')).not.toBeInTheDocument();
  });

  test('conformNameがtrueの場合にUserNameのクラスが正しく変更されるか', async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(
      'ユーザー名を入力してください(5文字まで)'
    );
    fireEvent.change(input, { target: { value: 'あああ' } });
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      const userNameElement = screen.getByText('あああさん、ようこそ！');
      expect(userNameElement).toBeInTheDocument();
    });
  });
  test('showLinksがtrueの場合にRoomButtonが表示されるか', async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(
      'ユーザー名を入力してください(5文字まで)'
    );
    fireEvent.change(input, { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByText('OK'));

    // showLinksをtrueに設定する
    fireEvent.click(screen.getByText('確定'));
    await waitFor(() => {
      const roomButton = screen.queryByText('Mocked RoomButton');
      expect(roomButton).toBeInTheDocument();
    });
  });
});
