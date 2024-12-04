import { createMocks } from 'node-mocks-http';
import handler from '../../pusher/wait-room-pusher';
import Pusher from 'pusher';
jest.mock('pusher');

describe('/pusher/wait-room-pusher APIのテスト', () => {
  const mockRoomInfo = {
    id: '123456',
    limitPlayer: 2,
    member: [
      {
        id: '111111',
        name: 'player',
        host: true,
      },
    ],
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockRoomInfo,
    });

    jest.clearAllMocks();
  });
  it('GETメソッド以外のリクエストの時405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      message:
        '不正なリクエストメソッドです。GETメソッドのみ許可されています。',
    });
  });
  it('queryがない時400エラーが返ることを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'roomIdが正しくありません。',
    });
  });
  // it('fetchJson関数がthrowを投げたとき500エラーを返すことを確認', async () => {
  //   global.fetch = jest.fn().mockResolvedValueOnce({
  //     ok: false,
  //     status: 404,
  //   });
  //   const { req, res } = createMocks({
  //     method: 'GET',
  //     query: { roomId: '123456' },
  //   });
  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res._getJSONData()).toEqual({
  //     message: 'server error : HTTP error! status: 404',
  //   });
  // });

  // it('pusherリクエストが失敗したときthrowが投げられて500エラーが出ることを確認', async () => {
  //   const { req, res } = createMocks({
  //     method: 'GET',
  //     query: { roomId: '123456' },
  //   });
  //   const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
  //   mockPusher.prototype.trigger.mockResolvedValue({
  //     ok: false,
  //     status: 400,
  //   } as Pusher.Response);

  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res._getJSONData()).toEqual({
  //     message: 'server error : 画面を同期できませんでした。',
  //   });
  // });

  // it('pusherリクエストが正常に動作し200コードを返すことを確認', async () => {
  //   const { req, res } = createMocks({
  //     method: 'GET',
  //     query: { roomId: '123456' },
  //   });
  //   const mockPusher = Pusher as jest.MockedClass<typeof Pusher>;
  //   mockPusher.prototype.trigger.mockResolvedValue({
  //     ok: true,
  //     status: 200,
  //   } as Pusher.Response);

  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(200);
  //   expect(res._getJSONData()).toEqual({ message: '同期ができました。' });
  // });
});
