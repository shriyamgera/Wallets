import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Header from '../Components/Header';
import { Link } from 'react-router-dom';
import { sendApiRequest } from '../http'

const Page1 = () => {
  const [localWalletId, setLocalWalletId] = useState('');
  const [walletDetails, setWalletDetails] = useState({});
  const [transactionType, setTransactionType] = useState('CREDIT');
  const [error, setError] = useState('');

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

  const walletFormik = useFormik({
    initialValues: {
      username: '',
      initialBalance: '',
    },
    validate: values => {
      const errors = {};

      if (!values.username) {
        errors.username = 'Username is required';
      }

      if (values.initialBalance && !/^\d+(\.\d{1,4})?$/.test(values.initialBalance)) {
        errors.initialBalance = 'Invalid balance format';
      }

      return errors;
    },
    onSubmit: async values => {
      try {
        const walletBody = {
          name: values.username,
          balance: values.initialBalance || 0,
        };

        const data = await sendApiRequest('setup', {
          method: 'POST',
          body: JSON.stringify(walletBody),
        });

        localStorage.setItem('walletId', data.id);
        setLocalWalletId(data.id);
      } catch (error) {
        console.error('Error setting up wallet:', error.message);
      }
    },
  });

  const transactionFormik = useFormik({
    initialValues: {
      amount: '',
      description: '',
    },
    validate: values => {
      const errors = {};

      if (!values.amount) {
        errors.amount = 'Amount is required';
      }

      if (values.amount && !/^\d+(\.\d{1,4})?$/.test(values.amount)) {
        errors.amount = 'Invalid amount format';
      }
      if (!values.description) {
        errors.description = 'Description is required';
      }

      return errors;
    },
    onSubmit: async values => {
      try {
        let amount = Number(values.amount);
        if (transactionType === 'DEBIT') {
          amount = -amount;
        }

        const transactionBody = {
          amount: amount,
          description: values.description,
        };

        const data = await sendApiRequest(`transact/${localWalletId}`, {
          method: 'POST',
          body: JSON.stringify(transactionBody),
        });

        setError(data.error);
        fetchWalletDetails();
      } catch (error) {
        console.error('Error executing transaction:', error.message);
      }
      transactionFormik.resetForm();
    },
  });

  return (
    <>
      <div className='flex flex-col h-screen text-xl justify-center'>
        {localWalletId ? (
          <>
            <Header username={walletDetails?.name} walletId={localWalletId} balance={walletDetails?.balance} />
            <div className='self-center flex flex-col mt-[10%]'>
              <div className='self-center glassmorphism min-w-[500px] min-h-[500px] p-10 bg-white flex flex-col gap-10 items-center justify-center'>
                <h1 className='text-blue-400 font-extrabold text-3xl'>Create Transaction</h1>
                <form
                  className='flex items-center justify-center gap-5 flex-col'
                  onSubmit={transactionFormik.handleSubmit}
                >
                  <input
                    type='text'
                    name='amount'
                    value={transactionFormik.values.amount}
                    onChange={transactionFormik.handleChange}
                    onBlur={transactionFormik.handleBlur}
                    placeholder='Enter Amount'
                    className='p-2'
                  />
                  {transactionFormik.touched.amount && transactionFormik.errors.amount && (
                    <div className='text-red-500 text-base'>{transactionFormik.errors.amount}</div>
                  )}
                  <input
                    type='text'
                    name='description'
                    value={transactionFormik.values.description}
                    onChange={transactionFormik.handleChange}
                    onBlur={transactionFormik.handleBlur}
                    placeholder='Enter Description'
                    className='p-2'
                  />
                  {transactionFormik.touched.description && transactionFormik.errors.description && (
                    <div className='text-red-500 text-base'>{transactionFormik.errors.description}</div>
                  )}

                  <div className='flex items-center gap-2'>
                    <label className='mr-5 flex items-center gap-3'>
                      <input
                        className='w-6 h-6'
                        type='radio'
                        name='type'
                        value='CREDIT'
                        checked={transactionType === 'CREDIT'}
                        onChange={() => setTransactionType('CREDIT')}
                      />
                      <span className='text-green-500 text-center'>Credit</span>
                    </label>
                    <label className='mr-5 flex items-center gap-3'>
                      <input
                        className='w-6 h-6'
                        type='radio'
                        name='type'
                        value='DEBIT'
                        checked={transactionType === 'DEBIT'}
                        onChange={() => setTransactionType('DEBIT')}
                      />
                      <span className='text-red-500 text-center'>Debit</span>
                    </label>
                  </div>

                  <button className='h-[50px] w-[100px] bg-[#232854] text-white mt-5 rounded-md' type='submit'>
                    Submit
                  </button>
                  {error && <div className='text-red-500 text-2xl'>{error}</div>}
                </form>
              </div>
              <Link to='/page2' className='p-5 mt-5 bg-[#232854] text-white rounded-md max-w-82 self-center'>
                Page 2
              </Link>
            </div>
          </>
        ) : (
          <div className='self-center glassmorphism min-w-[500px] min-h-[500px] p-10 bg-white flex flex-col gap-10 items-center justify-center'>
            <h1 className='text-blue-400 font-extrabold text-3xl'>Create Wallet</h1>
            <form className='flex items-center justify-center gap-5 flex-col' onSubmit={walletFormik.handleSubmit}>
              <input
                type='text'
                name='username'
                value={walletFormik.values.username}
                onChange={walletFormik.handleChange}
                onBlur={walletFormik.handleBlur}
                placeholder='Username'
                className='p-2'
              />
              {walletFormik.touched.username && walletFormik.errors.username && (
                <div className='text-red-500 text-base'>{walletFormik.errors.username}</div>
              )}

              <input
                type='text'
                name='initialBalance'
                value={walletFormik.values.initialBalance}
                onChange={walletFormik.handleChange}
                onBlur={walletFormik.handleBlur}
                placeholder='Initial Balance'
                className='p-2'
              />
              {walletFormik.touched.initialBalance && walletFormik.errors.initialBalance && (
                <div className='text-red-500 text-base'>{walletFormik.errors.initialBalance}</div>
              )}

              <button className='h-[50px] w-[100px] bg-[#232854] text-white mt-5 rounded-md' type='submit'>
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Page1;
