import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Title from './title';
import styles from './title.module.css';

// ここでモックを適用
jest.mock('next/font/google', () => ({
  Yuji_Syuku: jest.fn(() => ({
    className: 'yuji_Syuku_mock_class', // モックされたクラス名
  })),
}));

describe('titleコンポーネントのテスト', () => {
  it('タイトルが表示されているか', () => {
    render(<Title />);

    const text1 = screen.getByText('人');
    const text2 = screen.getByText('生');
    const text3 = screen.getByText('ゲ');
    const text4 = screen.getByText('ー');
    const text5 = screen.getByText('ム');

    expect(text1).toBeInTheDocument();
    expect(text2).toBeInTheDocument();
    expect(text3).toBeInTheDocument();
    expect(text4).toBeInTheDocument();
    expect(text5).toBeInTheDocument();
  });

  it('スタイルがちゃんと当たっているか', () => {
    const { container } = render(<Title />);

    // titleクラスがdivタグに適用されているか確認
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass(styles.title); // title.module.cssに定義されたクラス名をチェック
  });

  it('googleフォントが適用されているか', () => {
    const { container } = render(<Title />);

    // p要素を取得
    const pElement = container.querySelector('p');

    // p要素にモックされたclassNameが含まれていることを確認
    if (pElement) {
      expect(pElement.className).toContain('yuji_Syuku_mock_class');
    }
  });
});
