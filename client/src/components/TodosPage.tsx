"use client";

import React, { useState, useEffect } from "react";
import { logoutUser } from "../utils/api";
import { todosApi } from "@/utils/supabase";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

const TodosPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // First, try to get the access token from the server
        const response = await fetch('http://localhost:3000/auth/token', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const { setAccessToken } = await import('../utils/supabase');
          setAccessToken(data.token);
          console.log('🔐 Access token set from server');
        } else {
          // If no token available, redirect to login
          window.location.href = "/";
          return;
        }
        
        const todos = await todosApi.getTodos();
        setTodos(todos);
        setMessage(null);
      } catch (error) {
        console.error('Error fetching todos:', error);
        if (error instanceof Error && error.message.includes('No authentication token available')) {
          // Redirect to login if no token available
          window.location.href = "/";
        } else {
          setMessage({
            type: "error",
            text: `Failed to fetch todos: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // const fetchTodos = async () => {
  //   try {
  //     console.log("🔍 Starting fetchTodos...");

  //     const response = await fetch("http://localhost:3000/todos", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Cache-Control": "no-cache",
  //       },
  //       credentials: "include",
  //     });

  //     console.log("🔍 Response status:", response.status);
  //     console.log("🔍 Response headers:", response.headers);
  //     console.log("🔍 Response ok:", response.ok);

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("🔍 Fetching todos...", data);
  //       setTodos(data.todos || data.data || []);
  //     } else if (response.status === 401) {
  //       console.log("🔍 Unauthorized - redirecting to login");
  //       window.location.href = "/";
  //     } else {
  //       const errorData = await response.json();
  //       console.log("🔍 Failed to fetch todos:", errorData);
  //       setMessage({
  //         type: "error",
  //         text: `Failed to fetch todos: ${response.status}`,
  //       });
  //     }
  //   } catch (error) {
  //     console.log("🔍 Failed to fetch todos:", error);
  //     setMessage({
  //       type: "error",
  //       text: `Network error: ${
  //         error instanceof Error ? error.message : "Unknown error"
  //       }`,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  console.log("🔍 Todos:", todos);
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Redirect to login page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = await todosApi.addTodo(newTodo);
      setTodos((prev) => [todo, ...prev]);
      setNewTodo("");
      setMessage({
        type: "success",
        text: "Todo added successfully!",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      setMessage({
        type: "error",
        text: `Failed to add todo: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={addTodo} className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Todos List */}
        <div className="bg-white rounded-lg shadow-sm">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">
                No todos yet. Add your first todo above!
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      readOnly
                    />
                    <span
                      className={`ml-3 text-lg ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(todo.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodosPage;
