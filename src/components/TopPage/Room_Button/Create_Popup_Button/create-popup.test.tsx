import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import CreatePopup from './create-popup';
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
const mockRouter = useRouter as jest.Mock;
describe('create-popupコンポーネントのテスト', () => {
  const mockCloseChanger = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createPopがtrueの時、表示が正しいか', () => {
    render(
      <CreatePopup
        closeChanger={mockCloseChanger}
        createPop={true}
        playerName={'player1'}
      />
    );
    const element1 = screen.getByTestId('popClass1');
    const element2 = screen.getByTestId('popClass2');
    expect(element1).toHaveClass('visibl');
    expect(element2).toHaveClass('createPop');
    expect(screen.getByText('何人と遊ぶ？')).toBeInTheDocument();
    expect(screen.getByText('2人')).toBeInTheDocument();
    expect(screen.getByText('3人')).toBeInTheDocument();
    expect(screen.getByText('4人')).toBeInTheDocument();
    expect(screen.getByText('5人')).toBeInTheDocument();
  });

  it('createPopがtrueの時、styles.hidde、 styles.createNoPopが適応されているか', () => {
    render(
      <CreatePopup
        closeChanger={mockCloseChanger}
        createPop={false}
        playerName={'player1'}
      />
    );
    const element1 = screen.getByTestId('popClass1');
    const element2 = screen.getByTestId('popClass2');
    expect(element1).toHaveClass('hidde');
    expect(element2).toHaveClass('createNoPop');
  });

  it('人数選択ボタンが押されたとき正しくAPIリクエストが実行されるか', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        roomId: '123456',
        yourId: '111111',
      }),
    });
    const mockRouterPush = jest.fn();
    mockRouter.mockReturnValue({
      push: mockRouterPush,
    });
    render(
      <CreatePopup
        closeChanger={mockCloseChanger}
        createPop={true}
        playerName={'player1'}
      />
    );

    const button = screen.getByText('2人');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    // fetchが正しく呼び出されているか
    expect(global.fetch).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SERVER_URL + '/api/session/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ limitPlayer: 2, playerName: 'player1' }),
      }
    );

    // routerに正しい遷移先のパスが設定されているか
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith(
        '/game?roomId=123456&userId=111111'
      );
    });
  });

  it('人数選択ボタンが押されたとき、APIリクエストが失敗したときエラー表示されるか', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
    });
    render(
      <CreatePopup
        closeChanger={mockCloseChanger}
        createPop={true}
        playerName={'player1'}
      />
    );
    const button = screen.getByText('2人');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.getByText('ルーム作成に失敗しました。')
      ).toBeInTheDocument();
    });
  });

  it('Xボタンを押すとcloseChangerが実行されることを確認', () => {
    render(
      <CreatePopup
        closeChanger={mockCloseChanger}
        createPop={true}
        playerName={'player1'}
      />
    );

    const button = screen.getByText('X');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockCloseChanger).toHaveBeenCalledTimes(1);
  });
});
