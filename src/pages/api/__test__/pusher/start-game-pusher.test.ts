import { createMocks } from 'node-mocks-http';
import handler from '../../pusher/start-game-pusher';
import Pusher from 'pusher';
jest.mock('pusher');

describe('/pusher/start-game APIのテスト', () => {
  it('GETメソッド以外のリクエストの時405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      error: '不正なリクエストメソッドです。GETメソッドのみ許可されています。',
    });
  });

  it('queryがないリクエストの時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: 'roomIdが指定されていません。',
    });
  });

  it('pusherリクエストが失敗したときエラーがthrowされ500コードが返されることを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { roomId: '123456' },
    });
    const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
    mockPusher.prototype.trigger.mockResolvedValue({
      status: 400,
    } as Pusher.Response);
    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'server error : pusher 同期ができませんでした。',
    });
  });

  it('pusherリクエストが成功し200コードが返されることを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { roomId: '123456' },
    });
    const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
    mockPusher.prototype.trigger.mockResolvedValue({
      status: 200,
    } as Pusher.Response);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'ゲームが正常に開始されました。',
    });
  });
});
