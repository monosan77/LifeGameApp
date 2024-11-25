import { createMocks } from 'node-mocks-http';
import handler, { moveToNextPlayer } from '../../game/taun-change';

describe('/game/taun-change API のテスト', () => {
  describe('movetoNextPlayer関数のテスト', () => {
    it('正常に次のプレイヤーを返すことを確認', () => {
      const mockPosition = [1, 1, 1];
      const mockCurrent = 0;
      const nextPlayer = moveToNextPlayer(mockCurrent, mockPosition);
      expect(nextPlayer).toBe(1);
    });
    it('最後のターンのプレイヤーの時次のプレイヤーが1一番目のプレイヤーになることを確認', () => {
      const mockPosition = [1, 1, 1];
      const mockCurrent = 2;
      const nextPlayer = moveToNextPlayer(mockCurrent, mockPosition);
      expect(nextPlayer).toBe(0);
    });
    it('次のプレイヤーがゴールしていた時、そのプレイヤーをスキップすることを確認', () => {
      const mockPosition = [1, 51, 1];
      const mockCurrent = 0;
      const nextPlayer = moveToNextPlayer(mockCurrent, mockPosition);
      expect(nextPlayer).toBe(2);
    });
    it('自分以外がゴールしていた時、再度自分のターンなることを確認', () => {
      const mockPosition = [1, 51, 51];
      const mockCurrent = 0;
      const nextPlayer = moveToNextPlayer(mockCurrent, mockPosition);
      expect(nextPlayer).toBe(0);
    });
    it('全てのプレイヤーゴールしていた時-1を返すことを確認', () => {
      const mockPosition = [51, 51, 51];
      const mockCurrent = 0;
      const nextPlayer = moveToNextPlayer(mockCurrent, mockPosition);
      expect(nextPlayer).toBe(-1);
    });
  });

  describe('handlerのテスト', () => {
    const mockCurrentPlayer = [1, 1, 1];
    it('POSTメソッド以外のリクエストの時、405エラーを返すことを確認', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData()).toEqual({
        error: 'リクエストエラー：メソッドが不正です。',
      });
    });

    it('queryがリクエストにない時400エラーを返すことを確認', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: {},
        body: { newPosition: mockCurrentPlayer, currentPlayer: 0 },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: 'リクエストのパラメータが不正です',
      });
    });
    it('bodyがリクエストにない時400エラーを返すことを確認', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { roomId: '123456' },
        body: {},
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: 'リクエストのパラメータが不正です',
      });
    });

    it('pusherリクエストが失敗したときthrowが投げられ500エラーを返すことを確認', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { roomId: '123456' },
        body: {
          newPosition: mockCurrentPlayer,
          currentPlayer: 0,
          newMoney: [0, 0, 0],
        },
      });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => {},
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: 'server error : HTTP error! status: 400',
      });
    });

    it('pusherリクエストが正常に完了し、200コードを返すことを確認', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        query: { roomId: '123456' },
        body: {
          newPosition: mockCurrentPlayer,
          currentPlayer: 0,
          newMoney: [0, 0, 0],
        },
      });
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => ({ message: '正常終了' }),
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: '正常に処理が完了しました。',
      });
    });
  });
});
