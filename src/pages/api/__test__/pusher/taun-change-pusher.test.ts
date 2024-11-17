import { createMocks } from 'node-mocks-http';
import Pusher from 'pusher';
import handler from '../../pusher/taun-change-pusher';
jest.mock('pusher');
describe('/pusher/taun-change APIのテスト', () => {
  it('POSTリクエスト以外のリクエストの時405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      error: '不正なリクエストメソッドです。POSTメソッドのみ許可されています。',
    });
  });

  it('queryが無い時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: {},
      body: { nextPlayer: 1 },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: 'roomIdまたはnextPlayerデータがありません。',
    });
  });
  it('bodyが無い時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { roomId: '123456' },
      body: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: 'roomIdまたはnextPlayerデータがありません。',
    });
  });

  it('pusherリクエストがエラーの時throwを投げ500エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { roomId: '123456' },
      body: { nextPlayer: 1 },
    });
    const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
    mockPusher.prototype.trigger.mockResolvedValue({
      status: 400,
    } as Pusher.Response);
    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'server error : pusher APIで同期できませんでした。',
    });
  });
  it('pusherリクエストが正常に動作し200コードを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { roomId: '123456' },
      body: { nextPlayer: 1 },
    });
    const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
    mockPusher.prototype.trigger.mockResolvedValue({
      status: 200,
    } as Pusher.Response);
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'プレイヤーが正常に同期されました。',
    });
  });
});
