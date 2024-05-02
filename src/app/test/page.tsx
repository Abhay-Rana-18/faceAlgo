'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState<string>(""); // State for user data
  const [isLoading, setIsLoading] = useState(false); // Flag for loading state
  const [error, setError] = useState(null); // State for error message

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.get('/api/users');
        console.log(response);
        setUsers("data"); // Update user data state

      } catch (error) {
        console.log("error");
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          Hello World! {users}
        </>
      )}
    </>
  );
}
