import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

const createExpenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().datetime().optional(), // optional because it will be set to the current date if not provided
});

// all expense routes are protected by the auth middleware
router.use(authenticateToken);

// list users expenses
router.get("/", async (req: AuthRequest, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user!.userId },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// create a new expense
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { amount, description, categoryId, date } = createExpenseSchema.parse(
      req.body
    );

    const expense = await prisma.expense.create({
      data: {
        amount,
        description,
        categoryId,
        date: date ? new Date(date) : new Date(),
        userId: req.user!.userId,
      },
      include: { category: true },
    });

    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.flatten().fieldErrors,
      });
    }

    console.error("Create expense error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
