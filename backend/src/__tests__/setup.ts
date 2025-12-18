import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';

beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/commitforce-test';
    await mongoose.connect(mongoUri);
});

afterEach(async () => {
    // Clean up database after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    // Disconnect after all tests
    await mongoose.connection.close();
});
