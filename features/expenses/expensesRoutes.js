import express from "express";
import authenticate from "../../middlewares/authenticate.js";
import ExpenseControllers from "./expensesControllers.js";

const router = express.Router();

// Add new expense route
router.post("/", authenticate, ExpenseControllers.createExpenseController);

// Get all expenses route
router.get("/", authenticate, ExpenseControllers.getExpensesController);

// Get expense by id
router.get("/:id", authenticate, ExpenseControllers.getExpenseByIdController);

// Update expense by id
router.put("/:id", authenticate, ExpenseControllers.updateExpenseByIdController);

// Delete expense by id
router.delete("/:id", authenticate, ExpenseControllers.deleteExpenseByIdController);
export default router;