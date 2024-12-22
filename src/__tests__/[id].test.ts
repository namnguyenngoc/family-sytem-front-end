import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/blog/[id]';

describe('/api/blog/[id] API Endpoint', () => {
    it('should return the blog ID', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: {
                id: '123',
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData()).toEqual({ message: 'Blog ID: 123' });
    });
});