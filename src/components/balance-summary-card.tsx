export const BalanceSummaryCard = () => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900">Balance Summary</h3>
        <div className="mt-4">
          <p className="text-2xl font-bold text-green-600">$0.00</p>
          <p className="text-sm text-gray-500">Total balance</p>
        </div>
      </div>
    </div>
  );
};
