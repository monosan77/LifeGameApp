import { createMocks } from 'node-mocks-http';
import handler from '../../session/create';

describe('session/create APIのテスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('POSTリクエストでないとき405エラーを返すことを確認', async () => {
    const { res, req } = createMocks({
      method: 'GET',
      body: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });

  it('リクエストのbodyの中身が不正の時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: '不正なリクエストです。クエリが不正。',
    });
  });

  it('Pusherへのリクエストが失敗したときにthrowが発生し500エラーを返すことを確認', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
      });
    const { req, res } = createMocks({
      method: 'POST',
      body: { limitPlayer: 4, playerName: 'player' },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'Server Error : HTTP Error! status:400',
    });
  });

  it('ルームすでにあるか確認するfetchが失敗したときthrowが発生し500エラーを返すことを確認', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
    });
    const { req, res } = createMocks({
      method: 'POST',
      body: { limitPlayer: 4, playerName: 'player' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'Server Error : HTTP Error! status:400',
    });
  });
  it('作成したルームIDがすでに存在していた時throwが発生し500エラーを返すことを確認', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 123456 }],
    });
    const { req, res } = createMocks({
      method: 'POST',
      body: { limitPlayer: 4, playerName: 'player' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: 'ルーム作成に失敗しました。存在するIDです。',
    });
  });

  it('正常にAPIが動作し200のステータスコードを返すことを確認', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    const { req, res } = createMocks({
      method: 'POST',
      body: { limitPlayer: 4, playerName: 'player' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
