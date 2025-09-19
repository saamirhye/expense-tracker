"use client";

import { useEffect, useState } from "react";
import { apiClient, Expense } from "@/lib/api";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    description: "",
    categoryId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // load data when component mounts
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // get user from local storage
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }

        // fetch expenses
        const [expensesData, categoriesData] = await Promise.all([
          apiClient.getExpenses(),
          apiClient.getCategories(),
        ]);

        setExpenses(expensesData);
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const expense = await apiClient.createExpense(
        parseFloat(newExpense.amount),
        newExpense.description,
        newExpense.categoryId
      );

      // update the expenses list
      setExpenses([expense, ...expenses]);

      // reset the form
      setNewExpense({ amount: "", description: "", categoryId: "" });
      setShowAddForm(false);
    } catch (err: any) {
      alert("Failed to add expense: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-red-600'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-4xl mx-auto px-4 py-4 flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Expense Tracker
            </h1>
            <p className='text-gray-600'>Welcome back, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Quick Stats */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>Overview</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {expenses.length}
              </div>
              <div className='text-gray-600'>Total Expenses</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                $
                {expenses
                  .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
                  .toFixed(2)}
              </div>
              <div className='text-gray-600'>Total Amount</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                $
                {expenses.length > 0
                  ? (
                      expenses.reduce(
                        (sum, exp) => sum + parseFloat(exp.amount),
                        0
                      ) / expenses.length
                    ).toFixed(2)
                  : (0.0).toFixed(2)}
              </div>
              <div className='text-gray-600'>Average</div>
            </div>
          </div>
        </div>

        {/* Add Expense Section */}
        <div className='mb-6'>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
            >
              + Add Expense
            </button>
          ) : (
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Add New Expense
              </h3>

              <form onSubmit={handleAddExpense} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Amount ($)
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      min='0'
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Category
                    </label>
                    <select
                      value={newExpense.categoryId}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          categoryId: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    >
                      <option value=''>Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Description
                  </label>
                  <input
                    type='text'
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div className='flex gap-3'>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors'
                  >
                    {submitting ? "Adding..." : "Add Expense"}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowAddForm(false);
                      setNewExpense({
                        amount: "",
                        description: "",
                        categoryId: "",
                      });
                    }}
                    className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Expenses List */}
        <div className='bg-white rounded-lg shadow-sm'>
          <div className='p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Recent Expenses
            </h2>

            {expenses.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                No expenses yet. Add your first expense to get started!
              </div>
            ) : (
              <div className='space-y-4'>
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'
                  >
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900'>
                        {expense.description}
                      </div>
                      <div className='text-sm text-gray-600'>
                        {expense.category.name} &#x2022;{" "}
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className='text-lg font-semibold text-gray-900'>
                      ${parseFloat(expense.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
