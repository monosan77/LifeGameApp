import { render } from '@testing-library/react';
import Roulette from './Roulette';

describe('Rouletteコンポーネントのテスト', () => {
  it('isRouletteAnimationが「true」の時のbackgroundクラスが適応されるか', () => {
    render(<Roulette isRouletteAnimation={true} rouletteStyle={'number-1'} />);

    const element = document.querySelector('.background');
    expect(element).toBeInTheDocument();
  });
  it('isRouletteAnimationが「false」の時のoffBackgroundクラスが適応されるか', () => {
    render(<Roulette isRouletteAnimation={false} rouletteStyle={'number-1'} />);

    const element = document.querySelector('.offBackground');
    expect(element).toBeInTheDocument();
  });
  it('propsで渡されたrouletteStyle（文字列）がクラス名として適応されているか', () => {
    render(<Roulette isRouletteAnimation={true} rouletteStyle={'number-1'} />);
    const element = document.querySelector('.number-1');
    expect(element).toBeInTheDocument();
  });
  it('すべてのcellのクラスが適応されているか確認', () => {
    render(<Roulette isRouletteAnimation={true} rouletteStyle={'number-1'} />);
    const cells = ['cell1', 'cell2', 'cell3', 'cell4', 'cell5', 'cell6'];
    cells.forEach((cell) => {
      expect(document.querySelector(`.${cell}`)).toBeInTheDocument();
    });
  });
});
