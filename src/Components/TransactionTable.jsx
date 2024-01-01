import moment from 'moment';


const TransactionsTable = ({ transactions }) => {
  return (
    <table border="1" className='text-white w-full mx-10'>
      <thead>
        <tr>
          <th className="px-10 py-5 text-start">Transaction Id</th>
          <th className="px-10 py-5 text-start">Description</th>
          <th className="px-10 py-5 text-start">Amount</th>
          <th className="px-10 py-5 text-start">Date</th>
          <th className="px-10 py-5 text-start">Balance</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.id} className="border-b-2 border-gray-700">
            <td className="px-10 py-2">{transaction.id}</td>
            <td className="px-10 py-2">{transaction.description}</td>
            <td className={`px-10 py-2 ${transaction.type === 'DEBIT' ? 'text-red-500' : 'text-green-500'}`}>
              {transaction.type === 'DEBIT' ? '-' : ''}{Math.abs(transaction.amount)}
            </td>
            <td className="px-10 py-2">{moment(transaction.date).format('DD-MM-YYYY HH:mm:ss')}</td>
            <td className="px-10 py-2">{transaction.balance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
