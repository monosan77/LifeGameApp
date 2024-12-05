import { createMocks } from 'node-mocks-http';
import handler from '../../session/exit';

describe('session/exit APIのテスト', () => {
  const mockPlayerInfoFalse = {
    playerInfo: {
      id: '123456',
      naem: 'player',
      host: false,
    },
  };

  const mockQuery = { roomId: '123456' };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('DELETEリクエストでないときに405エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('リクエスト時のクエリが不正の時に400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: {},
      body: mockPlayerInfoFalse,
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
  it('リクエスト時のbodyが不正の時に400エラーを返すことを確認', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: mockQuery,
      body: {},
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  // describe('playerInfo.host がtrueの時', () => {
  //   const mockPlayerInfoTrue = {
  //     playerInfo: {
  //       id: '123456',
  //       naem: 'player',
  //       host: true,
  //     },
  //   };

  //   it('正常にルームが削除され200ステータスコードを返すことを確認', async () => {
  //     const { req, res } = createMocks({
  //       method: 'DELETE',
  //       query: mockQuery,
  //       body: mockPlayerInfoTrue,
  //     });
  //     global.fetch = jest.fn().mockResolvedValueOnce({
  //       ok: true,
  //     });

  //     await handler(req, res);
  //     expect(res._getStatusCode()).toBe(200);
  //     expect(res._getJSONData()).toEqual({ message: 'ルームを削除しました。' });
  //   });
  //   it('ルームが削除できないとき500ステータスコードを返すことを確認', async () => {
  //     const { req, res } = createMocks({
  //       method: 'DELETE',
  //       query: mockQuery,
  //       body: mockPlayerInfoTrue,
  //     });
  //     global.fetch = jest.fn().mockResolvedValueOnce({
  //       ok: false,
  //       status: 404,
  //     });

  //     await handler(req, res);
  //     expect(res._getStatusCode()).toBe(500);
  //     expect(res._getJSONData()).toEqual({
  //       message: 'Server Error : ルーム削除できませんでした。',
  //     });
  //   });
  // });

  // describe('playerInfo.host がfalseの時', () => {
  //   const member = [{ id: '111111', name: 'player', host: true }];

  //   it('roomInfoが取得できなかったとき500エラー返すことを確認', async () => {
  //     const { req, res } = createMocks({
  //       method: 'DELETE',
  //       query: mockQuery,
  //       body: mockPlayerInfoFalse,
  //     });

  //     global.fetch = jest.fn().mockResolvedValueOnce({
  //       ok: false,
  //       status: 400,
  //     });

  //     await handler(req, res);
  //     expect(res._getStatusCode()).toBe(500);
  //     expect(res._getJSONData()).toEqual({
  //       message: 'Server Error : HTTP error! status: 400',
  //     });
  //   });
  //   it('PATCHリクエストが失敗したとき500エラーコードを返すとこ確認', async () => {
  //     const { req, res } = createMocks({
  //       method: 'DELETE',
  //       query: mockQuery,
  //       body: mockPlayerInfoFalse,
  //     });
  //     global.fetch = jest
  //       .fn()
  //       .mockResolvedValueOnce({
  //         ok: true,
  //         json: async () => ({ member: member }),
  //       })
  //       .mockResolvedValueOnce({
  //         ok: false,
  //         status: 500,
  //       });
  //     await handler(req, res);
  //     expect(res._getStatusCode()).toBe(500);
  //     expect(res._getJSONData()).toEqual({
  //       message: 'Server Error : 退出できませんでした。',
  //     });
  //   });

  //   it('200コードを返し、退室メッセージが返されることを確認', async () => {
  //     const { req, res } = createMocks({
  //       method: 'DELETE',
  //       query: mockQuery,
  //       body: mockPlayerInfoFalse,
  //     });
  //     global.fetch = jest
  //       .fn()
  //       .mockResolvedValueOnce({
  //         ok: true,
  //         json: async () => ({ member: member }),
  //       })
  //       .mockResolvedValueOnce({
  //         ok: true,
  //       });
  //     await handler(req, res);
  //     expect(res._getStatusCode()).toBe(200);
  //     expect(res._getJSONData()).toEqual({ message: '退室しました。' });
  //   });
  // });
});
