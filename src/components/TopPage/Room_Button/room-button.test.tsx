import '@testing-library/dom';
import RoomButton from './room-button';
import { render, screen } from '@testing-library/react';

interface PlayedNameProps {
  playerName: string;
}

jest.mock('./create-button', () => {
  return function CreateButtonMock({ playerName }: PlayedNameProps) {
    return <p>{playerName}さん：モック化された作るボタン</p>;
  };
});

jest.mock('./search-button', () => {
  return function SearchButtonMock({ playerName }: PlayedNameProps) {
    return <p>{playerName}さん：モック化された探すボタン</p>;
  };
});

describe('room-buttonコンポーネントのテスト', () => {
  test('コンポーネントがレンダリングされているか', () => {
    render(<RoomButton playerName="山田" />);

    expect(
      screen.getByText('山田さん：モック化された作るボタン')
    ).toBeInTheDocument();
    expect(
      screen.getByText('山田さん：モック化された探すボタン')
    ).toBeInTheDocument();
  });
});
