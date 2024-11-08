import { render, screen } from '@testing-library/react';
import TurnDisplay from './TurnDisplay';

describe('TurnDisplayコンポーネントのテスト', () => {
  const mockYourInfo = {
    id: '001',
    name: 'player1',
    host: true,
  };
  const mockMember = [
    {
      id: '001',
      name: 'player1',
      host: true,
    },
    {
      id: '002',
      name: 'player2',
      host: false,
    },
    {
      id: '003',
      name: 'player3',
      host: false,
    },
  ];
  it('yourInfoとmember[current]が等しい時に「あなたのターン」と表示されることを確認', () => {
    render(
      <TurnDisplay
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={0}
      />
    );
    const element = screen.getByText('あなたのターン');
    expect(element).toBeInTheDocument();
  });
  it('yourInfoとmember[current]が等しくない時に他のプレイヤーの名前が表示されることを確認', () => {
    render(
      <TurnDisplay
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={1}
      />
    );
    const element = screen.getByText('player2のターン');
    expect(element).toBeInTheDocument();
  });
  it('memberが空の時に「不明のターン」を表示されることを確認', () => {
    render(
      <TurnDisplay yourInfo={mockYourInfo} member={[]} currentPlayer={1} />
    );
    const element = screen.getByText('不明のターン');
    expect(element).toBeInTheDocument();
  });

  it('currentPlayerが0<member.lengthの範囲外の数が渡された時（異常系）', () => {
    render(
      <TurnDisplay
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={10}
      />
    );
    const element = screen.getByText('不明のターン');
    expect(element).toBeInTheDocument();
  });
});
