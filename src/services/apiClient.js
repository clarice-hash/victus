const api = {
  post: async (url, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: 'Bearer ' + token })
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { data: result };
  }
};
export default api;
