import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPopup from './search-popup';
import styles from './search-popup.module.css';

// useRouterをモック化
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// グローバルfetchのモック化
beforeEach(() => {
  global.fetch = jest.fn();  // ここでfetchをリセット
});


describe('SearchPopupコンポーネントのテスト', () => {
  test('findPopがtrueの場合、適切なスタイルが適用される', () => {
    const {container } =render(    
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
    const {container } = render(
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
    fireEvent.change(input, { target: { value: 'abc' } });   //テスト対象の input 要素の値を 'abc' に変更し、その変更イベント（change イベント）を発火させる処理。
    expect(screen.getByText('数字のみを入力してください')).toBeInTheDocument(); //abcを格納すると'数字のみ入力してください'と出てくるかを確認する処理。
  });

  test('ユーザーが6桁のIDを入力し、検索ボタンを押すと結果が表示される', async () => {
    const mockData = {   //ここでmockDataとして、データを作成する。
      id: '123456',
      member: [{ name: 'Player 1' }]
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
    expect(screen.getByText('検索候補が見つかりませんでした。')).toBeInTheDocument();
  });
  
});
