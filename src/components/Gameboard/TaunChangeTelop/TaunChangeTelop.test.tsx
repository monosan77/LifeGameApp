import { Members } from '@/types/session';
import TaunChangeTelop from './TaunChangeTelop';
import { render, screen } from '@testing-library/react';

describe('TaunChangeTelopコンポーネントのテスト', () => {
  const mockYourInfo: Members = { id: '001', name: 'player1', host: true };
  const mockMember: Members[] = [
    { id: '001', name: 'player1', host: true },
    { id: '002', name: 'player2', host: true },
    { id: '003', name: 'player3', host: true },
  ];
  it('自分のターンの時、あなたのターンが表示されるか', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={true}
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={0}
      />
    );
    const text = screen.getByText('あなたのターンです！！');
    expect(text).toBeInTheDocument();
  });
  it('自分のターンではないとき、他のプレイヤー名（player3)が表示されるか', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={true}
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={2}
      />
    );
    const text = screen.getByText('player3のターンです！！');
    expect(text).toBeInTheDocument();
  });
  it('currentPlayerがmemberの要素数より大きいとき（エラー処理）', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={true}
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={5}
      />
    );
    screen.debug();
    const text = screen.getByText('不明なターンです');
    expect(text).toBeInTheDocument();
  });
  it('currentPlayerが0より小さい時（エラー処理）', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={true}
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={-1}
      />
    );
    screen.debug();
    const text = screen.getByText('不明なターンです');
    expect(text).toBeInTheDocument();
  });

  it('isTaunChangeAnimationがfalseの時、「offTaunText」「offNextTaunPop」のクラスになっているか', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={false}
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={0}
      />
    );
    const className = screen.getByText('あなたのターンです！！');
    const element = document.querySelector('.offNextTaunPop');
    screen.debug();
    expect(className).toHaveClass('offTaunText');
    expect(element).toBeInTheDocument();
  });
  it('isTaunChangeAnimationがtrueの時、「offTaunText」のクラスになっているか', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={true}
        yourInfo={mockYourInfo}
        member={mockMember}
        currentPlayer={0}
      />
    );
    const className = screen.getByText('あなたのターンです！！');
    const element = document.querySelector('.nextTaunPop');

    screen.debug();
    expect(className).toHaveClass('taunText');
    expect(element).toBeInTheDocument();
  });
  it('memberが空の時不明なターンですと表示されるか。', () => {
    render(
      <TaunChangeTelop
        isTaunChangeAnimation={false}
        yourInfo={mockYourInfo}
        member={[]}
        currentPlayer={0}
      />
    );
    const text = screen.getByText('不明なターンです');
    expect(text).toBeInTheDocument();
  });
});
