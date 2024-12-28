import ApiError from "../../shared/apiError.js";
import httpStatusCodes from "../../shared/httpStatusCodes.js";
import Expense from "../../models/expenseModel.js";

class ExpenseServices {

  // Craete expense handler
  static async createExpense(userId, description, amount){
    const expense = await Expense.create(
      {
        description: description,
        amount: amount,
        userId: userId
      }
    );
    if(!expense){
      throw new ApiError("erorr adding expenses", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    return expense;
  }

  // Get all expenses handler
  static async getAllExpenses(userId, page){
    const limit = 5;
    const offset = ( page - 1 ) * limit;

    // Get expenses with pagination.
    const allExpenses = await Expense.findAll({
      where: { userId: userId },
      limit: limit,
      offset: offset
    });

    if(!allExpenses){
      throw new ApiError("error getting expenses", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    if(allExpenses.length === 0){
      throw new ApiError("your expenses list is empty", httpStatusCodes.OK);
    }

    // Get the total count of expenses (without pagination), And calculate the total pages count.
    const totalExpenses  = await Expense.count({ where: { userId: userId } });
    const totalPages = Math.ceil(totalExpenses / limit);

    // pagination details.
    const pagination = {
      currentPage: page,
      totalExpenses: totalExpenses,
      totalPages: totalPages,
      expensesPerPage: limit
    }

    return { allExpenses, pagination };
  }

  // Get expense by id handler
  static async getExpenseById(userId, expneseId){
    const expense = await Expense.findOne({where: {
      expneseId: expneseId,
      userId: userId
    }});
    
    if (!expense) {
      throw new ApiError("expnese not found", httpStatusCodes.NOT_FOUND);
    }

    return expense;
  }

  // Update expnese by id andler
  static async updateExpenseById(expneseId, userId, newDescription, newAmount){
    const expense = await Expense.findOne({where: {
      expneseId: expneseId,
      userId: userId
    }});

    if(!expense){
      throw new ApiError("expnese not found", httpStatusCodes.NOT_FOUND);
    }

    expense.description = newDescription || expense.description;
    expense.amount = newAmount || expense.amount;
    const updatedExpense = await expense.save();

    if (!updatedExpense) {
      throw new ApiError("error updating expense", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedExpense;
  }

  // Delete expnese by id handler
  static async deleteExpenseById(expneseId, userId){
    const deleted = await Expense.destroy({where: {
      expneseId: expneseId,
      userId: userId
    }});

    if(!deleted){
      throw new ApiError("error deleteing expense", httpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    return deleted;
  }

}

export default ExpenseServices;