import { useEffect, useState } from 'react';
import Header from '../Components/Header';
import TransactionsTable from '../Components/TransactionTable';
import moment from 'moment';
import { sendApiRequest } from '../http';

const Page2 = () => {
  const [localWalletId, setLocalWalletId] = useState('');
  const [walletDetails, setWalletDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [sortby, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState(-1);
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(5);

  const handleChangeSortBy = (sortBy) => {
    setSortBy(sortBy);
    setSortOrder(-1);
    setPageNo(1);
  };

  const handleChangeSortOrder = () => {
    setSortOrder(sortOrder === 1 ? -1 : 1);
    setPageNo(1);
  };

  const handleChangePage = (type) => {
    if (type === 'inc') {
      setPageNo(pageNo + 1);
    } else {
      setPageNo(pageNo - 1);
    }
  };

  useEffect(() => {
    const walletId = localStorage.getItem('walletId');
    if (walletId) {
      setLocalWalletId(walletId);
    }
  }, []);

  useEffect(() => {
    if (localWalletId) {
      fetchWalletDetails();
    }
  }, [localWalletId]);

  const fetchWalletDetails = async () => {
    try {
      const data = await sendApiRequest(`wallet/${localWalletId}`);
      setWalletDetails(data);
    } catch (error) {
      console.error('Error fetching wallet details:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sendApiRequest(
          `transactions?walletId=${localWalletId}&sortby=${sortby}&sortOrder=${sortOrder}&skip=${(pageNo - 1) * limit}&limit=${limit}`
        );
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchData();
  }, [localWalletId, sortby, sortOrder, pageNo, limit]);

  const handleExportCSV = async () => {
    try {
      const data = await sendApiRequest(
        `transactions?walletId=${localWalletId}&sortby=${sortby}&sortOrder=${sortOrder}`
      );

      const csvContent = [
        ['Transaction ID', 'Description', 'Date', 'Amount', 'Updated Balance'],
        ...data.map((transaction) => {
          const formattedDate = moment(transaction.date).format('DD-MM-YYYY HH:mm:ss');
          const amount = transaction.type === 'DEBIT' ? -transaction.amount : transaction.amount;

          const csvRow = [
            transaction.id,
            transaction.description,
            formattedDate,
            amount,
            transaction.balance,
          ];
          return csvRow.join(',');
        }),
      ];

      const csvBlob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(csvBlob);
      downloadLink.download = 'transactions.csv';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error exporting transactions to CSV:', error.message);
    }
  };

  return (
    <>
      <div className='flex'>
        <Header username={walletDetails?.name} walletId={localWalletId} balance={walletDetails?.balance} />
        <h1 className='text-blue-500 font-extrabold text-4xl text-center mt-10'>Transactions</h1>
      </div>

      <div className='flex justify-center items-center flex-col mt-24 mx-5'>
        {/* Sorting Dropdown */}
        <label className="text-white mb-2">Sort By:</label>
        <select value={sortby} onChange={(e) => handleChangeSortBy(e.target.value)} className="p-2 mb-2">
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>

        {/* Sort Order Toggle */}
        <button onClick={handleChangeSortOrder} className="p-2 mb-2 text-white">
          {sortby === 'date' ? (
            sortOrder === 1 ? 'Oldest First' : 'Newest First'
          ) : (
            sortby === 'amount' ? (
              sortOrder === 1 ? 'Largest First' : 'Smallest First'
            ) : null
          )}
        </button>

        {/* Integrate TransactionsTable component */}
        {transactions.length === 0 ? <h2 className=' text-red-500'>No more Transactions</h2> : <TransactionsTable transactions={transactions} />}

        {/* Pagination Controls */}
        <div className="flex mt-3 text-xl font-bold">
          <button onClick={() => handleChangePage('dec')} disabled={pageNo === 1}>
            ⬅️
          </button>
          <span className="mx-3 text-white">{pageNo}</span>
          <button onClick={() => handleChangePage('inc')} disabled={limit > transactions.length}>
            ➡️
          </button>
        </div>
        <div className='flex flex-col items-center'>
          <h3 className=' text-white text-center mt-10'>Enter number of transactions per page</h3>
          <input className=' p-2 max-w-10 text-center my-5' value={limit} onChange={(e) => {
            setLimit(Number(e.target.value))
            setPageNo(1);
          }} />
        </div>
        <button onClick={() => { handleExportCSV() }} className='p-5 my-10 bg-[#232854] text-white rounded-md'>
          Export Transactions to CSV
        </button>
      </div>
    </>
  );
};

export default Page2;
