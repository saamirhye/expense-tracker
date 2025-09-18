import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/server";

const prisma = new PrismaClient();

describe("Authentication", () => {
  beforeAll(async () => {
    // clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test",
        },
      },
    });
  });

  afterAll(async () => {
    // clean up after tests
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "test",
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "testuser@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });

    it("should not register a user with invalid email", async () => {
      const userData = {
        email: "invalid-email",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Validation error");
    });

    it("should not register user with short password", async () => {
      const userData = {
        email: "test@example.com",
        password: "123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Validation error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      // create a user for login tests
      await request(app).post("/api/auth/register").send({
        email: "logintest@example.com",
        password: "password123",
      });
    });

    it("should login with valid credentials", async () => {
      const loginData = {
        email: "logintest@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user).not.toHaveProperty("passwordHash");
    });

    it("should not login with invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should not login with wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "logintest@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });
  });
});
