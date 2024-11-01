import { render, screen } from '@testing-library/react';
import UserName from './user-name';

describe('UserNameコンポーネントのテスト', () => {
  it('propsで引数が正常に渡されているか', () => {
    render(<UserName playerName="テストプレイヤー" />);

    const playerName = screen.getByText('テストプレイヤーさん、ようこそ！');
    expect(playerName).toBeInTheDocument();
  });
});
