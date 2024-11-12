import { render } from '@testing-library/react';
import Video from './video';

describe('ビデオコンポーネント', () => {
  test('ビデオが正しく表示されているか', () => {
    const { container } = render(<Video />);//renderには多くのプロパティを持つオブジェクトを返す。その中のcontainerは最上位のDOMを表す。
    const videoElement = container.querySelector('video');

    if (videoElement) {

      
      expect(videoElement).toBeInTheDocument(); // videoタグがレンダリングされている場合のテスト
      expect(videoElement).toHaveAttribute('autoPlay'); //toHaveAttributeでvideoタグに属性があるかどうかをテスト
      expect(videoElement).toHaveAttribute('loop');
      expect(videoElement.muted).toBe(true); //これはvideoElementの属性mutedがtrueであるかどうかを検証。
    } else {
      // videoタグが存在しない場合のテスト
      const fallbackText = container.querySelector('p'); //「Your browser does not support the video tag」を取得
      expect(fallbackText).toBeInTheDocument();  //それが描画されているかを検証
    }
  });

  test('スタイルが当たっているか', () => {
    const { container } = render(<Video />);
    const divElement = container.querySelector('div');
    expect(divElement).toHaveClass('video');//toHaveClassは、DOM要素に特定のCSSクラスが含まれているかどうかを検証するためのマッチャー
  });

  test('sourceの属性が当たっているかどうか', () => {
    const { container } = render(<Video />);
    const sourceElement = container.querySelector('source');
    expect(sourceElement).toHaveAttribute('src', '/life_of_game.mp4');
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });
});
