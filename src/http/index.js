export const sendApiRequest = async (url, options = {}) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error.message);
      throw error;
    }
  };