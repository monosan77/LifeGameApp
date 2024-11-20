import { createMocks } from 'node-mocks-http';
import handler from '../../game/start-game';

describe('/game/start-game APIのテスト', () => {
  it('GETメソッド以外のリクエスト時405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      error: '不正なリクエストメソッドです。',
    });
  });

  it('queryがないリクエスト時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: 'リクエストエラー: roomIdが必要です。',
    });
  });

  it('pusherへのリクエストが失敗したときthrowが投げられ500エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { roomId: '123456' },
    });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'server error : HTTP error! status: 400',
    });
  });

  it('pusherリクエストが正常に動作し200コードを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { roomId: '123456' },
    });
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => ({ message: '正常終了' }),
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'ゲームが正常に開始されました。',
    });
  });
});
