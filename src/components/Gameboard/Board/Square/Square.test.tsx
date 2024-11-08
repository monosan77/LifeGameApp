import { render, screen } from '@testing-library/react';
import Square from './Square';

describe('Squareコンポーネントのテスト', () => {
  it('すべてのアイコン画像が正しく正しく表示されるか', () => {
    const positions = [1, 1, 1, 1, 1];
    render(<Square playerPositions={positions} squareNumber={1} />);

    expect(screen.getAllByAltText('アイコン')).toHaveLength(5);
  });

  it('playerがマスにいないときにアイコンが表示されないことを確認', () => {
    const positions = [1, 1, 1, 1, 1];
    render(<Square playerPositions={positions} squareNumber={2} />);
    const icons = screen.queryAllByAltText('アイコン');
    expect(icons).toHaveLength(0);
  });

  it('参加プレイヤーがいないときにアイコンが表示されないことを確認', () => {
    render(<Square playerPositions={[]} squareNumber={1} />);

    const icons = screen.queryAllByAltText('アイコン');
    expect(icons).toHaveLength(0);
  });

  it('プレイヤーの数だけアイコンが表示されることを確認(参加プレイヤーが1名の時)', () => {
    const positions = [1];
    render(<Square playerPositions={positions} squareNumber={1} />);

    expect(screen.getAllByAltText('アイコン')).toHaveLength(1);
  });

  it('マスにいるプレイヤーの数だけアイコンが表示されることを確認(2人同じマスにいる時)', () => {
    const positions = [1, 2, 1, 2, 1];
    render(<Square playerPositions={positions} squareNumber={2} />);
    const icons = screen.queryAllByAltText('アイコン');
    expect(icons).toHaveLength(2);
  });
});
