import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/server";

const prisma = new PrismaClient();

describe("Expenses", () => {
  let userToken: string;
  let categoryId: string;

  beforeAll(async () => {
    // clean up test data
    await prisma.expense.deleteMany({
      where: {
        user: {
          email: {
            contains: "expensetest",
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "expensetest",
        },
      },
    });

    // create a test user and get token
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        email: "expensetest@example.com",
        password: "password123",
      });

    userToken = registerResponse.body.token;

    // get a test category
    const category = await prisma.category.findFirst();
    categoryId = category!.id;
  });

  afterAll(async () => {
    // clean up test data
    await prisma.expense.deleteMany({
      where: {
        user: {
          email: {
            contains: "expensetest",
          },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: {
          contains: "expensetest",
        },
      },
    });

    await prisma.$disconnect();
  });

  describe("POST /api/expenses", () => {
    it("should create a new expense successfully", async () => {
      const expenseData = {
        amount: 25.5,
        description: "Test lunch",
        categoryId: categoryId,
      };

      const response = await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${userToken}`)
        .send(expenseData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(parseFloat(response.body.amount)).toBe(25.5);
      expect(response.body.description).toBe("Test lunch");
      expect(response.body).toHaveProperty("category");
      expect(response.body.category.id).toBe(categoryId);
    });

    it("should not create an expense without token", async () => {
      const expenseData = {
        amount: 25.5,
        description: "Test lunch",
        categoryId: categoryId,
      };

      const response = await request(app)
        .post("/api/expenses")
        .send(expenseData)
        .expect(401);

      expect(response.body).toHaveProperty("error", "Access token required");
    });

    it("should not create an expense with negative amount", async () => {
      const expenseData = {
        amount: -10.5,
        description: "Test expense",
        categoryId: categoryId,
      };

      const response = await request(app)
        .post("/api/expenses")
        .set("Authorization", `Bearer ${userToken}`)
        .send(expenseData)
        .expect(400);

      expect(response.body).toHaveProperty("error", "Validation error");
    });
  });

  describe("GET /api/expenses", () => {
    it("should get user expenses with valid token", async () => {
      const response = await request(app)
        .get("/api/expenses")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // there should be at least one expense from the test
      expect(response.body.length).toBeGreaterThan(0);

      const expense = response.body[0];
      expect(expense).toHaveProperty("id");
      expect(expense).toHaveProperty("amount");
      expect(expense).toHaveProperty("description");
      expect(expense).toHaveProperty("category");
    });

    it("should not get expenses without token", async () => {
      const response = await request(app).get("/api/expenses").expect(401);

      expect(response.body).toHaveProperty("error", "Access token required");
    });
  });
});
