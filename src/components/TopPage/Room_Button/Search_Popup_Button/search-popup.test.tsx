import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPopup from './search-popup';
import styles from './search-popup.module.css';
import { useRouter } from 'next/router';

// useRouterをモック化
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// グローバルfetchのモック化
beforeEach(() => {
  global.fetch = jest.fn(); // ここでfetchをリセット
});

describe('SearchPopupコンポーネントのテスト', () => {
  test('findPopがtrueの場合、適切なスタイルが適用される', () => {
    const { container } = render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass(styles.visibles);
  });

  test('findPopがfalseの場合、適切なスタイルが適用される', () => {
    const { container } = render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={false}
        player="Test Player"
      />
    );
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass(styles.hiddens);
  });

  test('ユーザーが無効な文字を入力した場合にエラーメッセージが表示される', () => {
    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );

    const input = screen.getByPlaceholderText('入力してください...');
    fireEvent.change(input, { target: { value: 'abc' } }); //テスト対象の input 要素の値を 'abc' に変更し、その変更イベント（change イベント）を発火させる処理。
    expect(screen.getByText('数字のみを入力してください')).toBeInTheDocument(); //abcを格納すると'数字のみ入力してください'と出てくるかを確認する処理。
  });

  test('ユーザーが6桁のIDを入力し、検索ボタンを押すと結果が表示される', async () => {
    const mockData = {
      //ここでmockDataとして、データを作成する。
      id: '123456',
      member: [{ name: 'Player 1' }],
    };

    // fetchをモック
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(mockData),
      headers: {
        get: () => 'application/json',
      },
    });

    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );

    const input = screen.getByPlaceholderText('入力してください...');
    const searchButton = screen.getByText('検索');

    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(searchButton);

    const resultMessage = await waitFor(() =>
      screen.getByText('Player 1さんのルームでよろしいですか？')
    );

    expect(resultMessage).toBeInTheDocument();
  });

  test('ユーザーが検索しても候補が見つからなかった場合に適切なメッセージが表示される', async () => {
    // jest.fn()を使ってfetchをモック
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({}), // 空のデータ
      headers: {
        get: () => 'application/json',
      },
    });

    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );

    const input = screen.getByPlaceholderText('入力してください...');
    fireEvent.change(input, { target: { value: '999999' } });
    fireEvent.click(screen.getByText('検索'));

    // 検索候補が見つからないメッセージが表示されることを確認
    await waitFor(() => screen.getByText('検索候補が見つかりませんでした。'));
    expect(
      screen.getByText('検索候補が見つかりませんでした。')
    ).toBeInTheDocument();
  });

  test('検索ボタンが押されたときのエラー表示(ID未入力）', () => {
    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );
    const searchElement = screen.getByText('検索');
    expect(searchElement).toBeInTheDocument();
    fireEvent.click(searchElement);
    const errorMessage = screen.getByTestId('message');
    expect(errorMessage).toHaveTextContent('※ルームIDを入力してください。');
  });
  test('検索ボタンが押されたときのエラー表示(6桁未満）', async () => {
    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );
    const input = screen.getByPlaceholderText('入力してください...');
    expect(input).toBeInTheDocument();
    const searchButton = screen.getByText('検索');
    expect(searchButton).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '16' } });
    fireEvent.click(searchButton);

    const errorMessage = screen.getByTestId('message');
    expect(errorMessage).toHaveTextContent('※6桁の数字を入力してください。');
  });

  it('検索ボタンを押した後、fetchが失敗したときthrowが投げられエラー表示されることを確認', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });
    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );
    const input = screen.getByPlaceholderText('入力してください...');
    expect(input).toBeInTheDocument();
    const searchButton = screen.getByText('検索');
    expect(searchButton).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(searchButton);

    const errorMessage = await waitFor(() => {
      return screen.getByTestId('message');
    });
    expect(errorMessage).toHaveTextContent('IDが見つかりません。');
  });

  it('確定ボタンを押した後の処理', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({
          id: '123',
          member: [{ id: '123', name: 'player1' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
      });
    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );
    const input = screen.getByPlaceholderText('入力してください...');
    const searchButton = screen.getByText('検索');

    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(searchButton);

    const ConfirmedBtn = await waitFor(() => {
      return screen.getByText('確定');
    });
    expect(ConfirmedBtn).toBeInTheDocument();

    fireEvent.click(ConfirmedBtn);

    const errorMessage = await waitFor(() => {
      return screen.getByTestId('message');
    });
    expect(errorMessage).toHaveTextContent('※すでに満室です。');
  });

  it('確定を押した後正常に画面遷移パスが設定されることを確認', async () => {
    const mockRouter = useRouter as jest.Mock;
    const mockRouterPush = jest.fn();
    mockRouter.mockReturnValue({
      push: mockRouterPush,
    });
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({
          id: '123',
          member: [{ id: '123', name: 'player1' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({
          playerId: '123',
        }),
      });
    render(
      <SearchPopup
        closeChanger={() => {}}
        findPop={true}
        player="Test Player"
      />
    );
    const input = screen.getByPlaceholderText('入力してください...');
    const searchButton = screen.getByText('検索');

    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(searchButton);

    const ConfirmedBtn = await waitFor(() => {
      return screen.getByText('確定');
    });
    expect(ConfirmedBtn).toBeInTheDocument();

    fireEvent.click(ConfirmedBtn);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith(
        '/game?roomId=123&userId=123'
      );
    });
  });
});
