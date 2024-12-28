import ExpenseServices from "./expensesServices.js";
import returnError from "../../utils/returnError.js";
import ApiResponse from "../../shared/apiResponse.js";
import httpStatusCodes from "../../shared/httpStatusCodes.js";
import ApiError from "../../shared/apiError.js";

class ExpenseControllers {
  
  // @desc    Craete new expense
  // @route   POST /api/v1/expenses
  // @access  Private
  static async createExpenseController(req, res, next){
    const userId = req.user.id;
    const {description, amount} = req.body;
    if(!description || !amount){
      return next(new ApiError("all fields required (description, amount)", httpStatusCodes.UNPROCESSABLE_ENTITY));
    }
    try {
      const expense = await ExpenseServices.createExpense(userId, description, amount);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "EXPENSE CREATED", expense);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Craete new expense
  // @route   POST /api/v1/expenses?page=pageIndex
  // @access  Private
  static async getExpensesController(req, res, next){
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    try {
      const { allExpenses, pagination } = await ExpenseServices.getAllExpenses(userId, page);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "ALL EXPENSES", allExpenses, pagination);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Get expense by id
  // @route   GET /api/v1/expenses/:id
  // @access  Private
  static async getExpenseByIdController(req, res, next){
    const userId = req.user.id;
    const expneseId = req.params.id;
    try {
      const expense = await ExpenseServices.getExpenseById(userId, expneseId);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "EXPENSE BY ID", expense);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Update expense by id
  // @route   PUT /api/v1/expenses/:id
  // @access  Private
  static async updateExpenseByIdController(req, res, next){
    const userId = req.user.id;
    const expneseId = req.params.id;
    const { newDescription, newAmount } = req.body;
    try {
      const updated = await ExpenseServices.updateExpenseById(expneseId, userId, newDescription, newAmount);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "EXPENSE UPDATED", updated);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    }
  }

  // @desc    Delete expense by id
  // @route   DELETE /api/v1/expenses/:id
  // @access  Private
  static async deleteExpenseByIdController(req, res, next){
    const userId = req.user.id;
    const expneseId = req.params.id;
    try {
      const deletedExpense = await ExpenseServices.deleteExpenseById(expneseId, userId);
      const response = new ApiResponse(httpStatusCodes.RESOURCE_CREATED, "EXPENSE DELETED", deletedExpense);
      response.send(res);
    } catch (err) {
      returnError(err, next);
    } 
  }
}

export default ExpenseControllers;