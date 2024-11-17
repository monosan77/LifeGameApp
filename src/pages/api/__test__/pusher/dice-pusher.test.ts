import { createMocks } from 'node-mocks-http';
import handler from '../../pusher/dice-pusher';
import Pusher from 'pusher';

jest.mock('pusher');
describe('pusher/dice-pusher APIのテスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POSTメソッド以外のリクエストを受けとったとき405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      error: 'メソッドが許可されていません。POSTメソッドのみ許可されています。',
    });
  });
  it('queryが不正の時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: {},
      body: { diceResult: 1 },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: '不正なリクエストです。roomIdとdiceResultが必要です。',
    });
  });
  it('bodyが不正の時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { roomId: '123456' },
      body: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: '不正なリクエストです。roomIdとdiceResultが必要です。',
    });
  });

  it('pusherへのリクエストが失敗したとき500エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { roomId: '123456' },
      body: { diceResult: 1 },
    });

    const pusherMock = Pusher as jest.MockedClass<typeof Pusher>;
    pusherMock.prototype.trigger.mockResolvedValue({
      ok: true,
      status: 400,
    } as Pusher.Response);

    await handler(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      error: 'server error : Pusher APIで同期に失敗しました。',
    });
  });

  it('pusherへのリクエストが正常に完了し200コードを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      query: { roomId: '123456' },
      body: { diceResult: 1 },
    });

    const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
    mockPusher.prototype.trigger.mockResolvedValue({
      ok: true,
      status: 200,
    } as Pusher.Response);

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'サイコロの結果が正常に送信されました。',
    });
  });
});
