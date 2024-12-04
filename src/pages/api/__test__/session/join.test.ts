import { createMocks } from 'node-mocks-http';
import handler from '../../session/join';

describe('session/join APIのテスト', () => {
  const mockRoomInfo = {
    id: '123456',
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('PATCHリクエストではないとき400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'リクエストが不正です。不正なメソッド',
    });
  });

  it('リクエスト時のbodyが不正の時400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
      body: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: '不正なリクエストです。不正なbody',
    });
  });

  // it('fetchJSONでエラーがthrowされて500エラーコードが返されることを確認', async () => {
  //   const { req, res } = createMocks({
  //     method: 'PATCH',
  //     body: { playerName: 'player', roomInfo: mockRoomInfo },
  //   });
  //   global.fetch = jest.fn().mockResolvedValueOnce({
  //     ok: false,
  //     status: 405,
  //   });
  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res._getJSONData()).toEqual({
  //     message: 'Server Error : HTTP error! status: 405',
  //   });
  // });

  // it('満室のエラーを返すことを確認', async () => {
  //   const mockResponseRomm = {
  //     id: '123456',
  //     limitPlayer: 1,
  //     member: [
  //       {
  //         id: '1111111',
  //         name: 'player1',
  //         host: true,
  //       },
  //     ],
  //   };
  //   const { req, res } = createMocks({
  //     method: 'PATCH',
  //     body: { playerName: 'player', roomInfo: mockRoomInfo },
  //   });
  //   global.fetch = jest.fn().mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => mockResponseRomm,
  //   });

  //   await handler(req, res);

  //   expect(res._getStatusCode()).toBe(400);
  //   expect(res._getJSONData()).toEqual({
  //     message: 'すでに満室です',
  //   });
  // });
  // it('PATCHリクエストが失敗したとき500エラーコードを返すことを確認', async () => {
  //   const mockResponseRomm = {
  //     id: '123456',
  //     limitPlayer: 2,
  //     member: [
  //       {
  //         id: '1111111',
  //         name: 'player1',
  //         host: true,
  //       },
  //     ],
  //   };
  //   const { req, res } = createMocks({
  //     method: 'PATCH',
  //     body: { playerName: 'player', roomInfo: mockRoomInfo },
  //   });
  //   global.fetch = jest
  //     .fn()
  //     .mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => mockResponseRomm,
  //     })
  //     .mockResolvedValueOnce({
  //       ok: false,
  //       status: 400,
  //     });

  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(500);
  //   expect(res._getJSONData()).toEqual({
  //     message: 'Server Error : HTTP error! status: 400',
  //   });
  // });

  // it('リクエストが正常に動作し200コードを返すことを確認', async () => {
  //   const mockResponseRomm = {
  //     id: '123456',
  //     limitPlayer: 2,
  //     member: [
  //       {
  //         id: '1111111',
  //         name: 'player1',
  //         host: true,
  //       },
  //     ],
  //   };
  //   const { req, res } = createMocks({
  //     method: 'PATCH',
  //     body: { playerName: 'player', roomInfo: mockRoomInfo },
  //   });
  //   global.fetch = jest
  //     .fn()
  //     .mockResolvedValueOnce({
  //       ok: true,
  //       json: async () => mockResponseRomm,
  //     })
  //     .mockResolvedValueOnce({
  //       ok: true,
  //     });

  //   await handler(req, res);
  //   expect(res._getStatusCode()).toBe(200);
  // });
});
