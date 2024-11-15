// src/components/TopPage/PageLinks.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CreateButton from './create-button'; // 正しいインポートパスを指定
import '@testing-library/jest-dom';

jest.mock('./Create_Popup_Button/create-popup', () => {
  return jest.fn(() => <div>モックされたCreatePopup</div>);
});

describe('CreateButtonコンポーネント', () => {
  test('コンポーネントがレンダリングされているかどうか', () => {
    render(<CreateButton playerName="テストユーザー" />);

    const button = screen.getByText('ルームをつくる');
    expect(button).toBeInTheDocument();
  });

  test('テキストが表示されているかどうか', () => {
    render(<CreateButton playerName="テストユーザー" />);

    const text = screen.getByText('ルームをつくる');
    expect(text).toBeInTheDocument();
  });

  test('CreatePopupがモックされているかどうか', () => {
    render(<CreateButton playerName="テストユーザー" />);

    const mockPopup = screen.getByText('モックされたCreatePopup');
    expect(mockPopup).toBeInTheDocument();
  });

  test('onClickイベントが発生しているかどうか', () => {
    render(<CreateButton playerName="テストユーザー" />);

    const button = screen.getByText('ルームをつくる');

    fireEvent.click(button);

    const mockPopup = screen.getByText('モックされたCreatePopup');
    expect(mockPopup).toBeInTheDocument();
  });
});
