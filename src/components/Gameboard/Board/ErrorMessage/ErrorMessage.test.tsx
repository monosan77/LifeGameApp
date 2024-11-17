import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessageコンポーネントのテスト', () => {
  it('propsで受け取ったerrorMessageを正しく表示されるか', () => {
    render(
      <ErrorMessage isErrorAnimation={true} errorMessage={'errorMessage'} />
    );
    const text = screen.getByText('errorMessage');
    expect(text).toBeInTheDocument();
  });

  it('isErrorAnimationがtrueの時、onErrorContainerクラスが適応されているか', () => {
    render(
      <ErrorMessage isErrorAnimation={true} errorMessage={'errorMessage'} />
    );
    const element = screen.getByTestId('error-container');
    const text = screen.getByText('errorMessage');

    expect(element).toHaveClass('onErrorContainer');
    expect(text).toBeInTheDocument();
  });
  it('isErrorAnimationがfalseの時、offErrorContainerクラスが適応されているか', () => {
    render(<ErrorMessage isErrorAnimation={false} errorMessage={''} />);
    const element = screen.getByTestId('error-container');

    expect(element).toHaveClass('offErrorContainer');
    expect(element).toBeInTheDocument();
  });
  it('errorMessageが空の時に表示が正しく処理されるか', () => {
    render(<ErrorMessage isErrorAnimation={true} errorMessage={''} />);
    const text = screen.getByRole('heading', { level: 3 });
    expect(text).toHaveTextContent('');
  });
});
