import { beforeAll, afterAll, afterEach, vi } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

// Mock external services by default so tests don't call real APIs
vi.mock("../config/sendMail.js", () => ({
  default: vi.fn().mockResolvedValue({ success: true }),
  sendEnrollmentConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
}));

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key_123456789";
  process.env.NODE_ENV = "test";

  mongoServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 60000, // 60 seconds for Windows process spawn
    },
  });
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
}, 90000);

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);
