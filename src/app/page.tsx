export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Financial Planner
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Take control of your financial future
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Budget Overview
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Monthly Income</span>
                <span className="text-green-600 font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Monthly Expenses</span>
                <span className="text-red-600 font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-800 dark:text-white font-medium">Net Income</span>
                <span className="text-blue-600 font-bold">$0.00</span>
              </div>
            </div>
          </div>

          {/* Savings Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Savings Goals
            </h2>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No savings goals yet</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add Goal
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Recent Transactions
            </h2>
            <div className="space-y-3">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No transactions yet</p>
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Income
            </button>
            <button className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Add Expense
            </button>
            <button className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Set Budget
            </button>
            <button className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
