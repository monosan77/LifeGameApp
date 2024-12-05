import { render, screen } from '@testing-library/react';
import UserName from './user-name';

describe('UserNameコンポーネントのテスト', () => {
  it('propsで引数が正常に渡されているか', () => {
    render(<UserName playerName="テストプレイヤー" />);

    const playerName = screen.getByText('テストプレイヤー さん、ようこそ！');
    expect(playerName).toBeInTheDocument();
  });

  it('userNameクラスが適用されているか', () => {
    const { container } = render(<UserName playerName="テストプレイヤー" />);

    // pタグが正しいCSSクラス(userName)を持っているか確認
    const pElement = container.querySelector('p');
    expect(pElement).toHaveClass('userName');
  });
});
