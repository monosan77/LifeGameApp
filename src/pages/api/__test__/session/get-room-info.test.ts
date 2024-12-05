import { createMocks } from 'node-mocks-http';
import handler from '../../session/get-room-info';

describe('session/get-room-info APIのテスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('GETリクエスト出ないとき405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
  it('クエリが不正なとき400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '不正なリクエストです' });
  });

  // it('roomInfoがエラーの時500エラーが返されることを確認', async () => {
  //   const { req, res } = createMocks({
  //     method: 'GET',
  //     query: { roomId: '123456' },
  //   });
  //   global.fetch = jest.fn().mockResolvedValueOnce({
  //     ok: false,
  //     status: 404,
  //   });
  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res._getJSONData()).toEqual({
  //     message: 'Server Error : HTTP error! status: 404',
  //   });
  // });
  // it('すべて正常に動作し200とroomInfoを返すことを確認', async () => {
  //   const mockRoomInfo = {
  //     id: '123456',
  //     limitPlayer: 4,
  //     member: [
  //       {
  //         id: '000000',
  //         name: 'plater',
  //         host: false,
  //       },
  //     ],
  //   };
  //   const { req, res } = createMocks({
  //     method: 'GET',
  //     query: { roomId: '123456' },
  //   });
  //   global.fetch = jest.fn().mockResolvedValueOnce({
  //     ok: true,
  //     status: 200,
  //     json: async () => ({ roomInfo: mockRoomInfo }),
  //   });
  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(200);
  //   expect(res._getJSONData()).toEqual({
  //     roomInfo: {
  //       id: '123456',
  //       limitPlayer: 4,
  //       member: [
  //         {
  //           id: '000000',
  //           name: 'plater',
  //           host: false,
  //         },
  //       ],
  //     },
  //   });
  // });
});
