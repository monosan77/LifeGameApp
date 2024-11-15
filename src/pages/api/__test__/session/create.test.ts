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
});
