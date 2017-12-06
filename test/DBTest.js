import assert from 'assert';

import connect from './DBConnectionHelper';

describe('Connection DB', () => {
    it('should connect to database', async () => {
        try {
            const { success, db } = await connect();
            db.close();
            assert.equal(true, success);
        } catch (error) {
            assert.fail(error.message);
        }
    });
});