import '@testing-library/dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ShowError from './showError';

describe('ShowErrorコンポーネントのテスト', () => {
  test('引数が渡されてきているか', () => {
    const mockClose = jest.fn();
    render(<ShowError message="テストメッセージ" onClose={mockClose} />);
    const TextMessage = screen.getByText('テストメッセージ');

    expect(TextMessage).toBeInTheDocument();

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
  });

  test('ボタンが表示されているか', () => {
    const mockClose = jest.fn();
    render(<ShowError message="テストメッセージ" onClose={mockClose} />);
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });
});
