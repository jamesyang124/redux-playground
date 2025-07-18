// Mock server utilities and configuration
export const MOCK_SERVER_URL = 'http://localhost:3001'

// Simulated network delay for realistic behavior
export const NETWORK_DELAY = 500

// Types
export interface User {
  id: number
  name: string
  email: string
  phone?: string
  website?: string
  company?: {
    name: string
  }
  posts?: number
  createdAt?: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
  createdAt?: string
}

export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

// Mock API endpoints
export const API_ENDPOINTS = {
  users: `${MOCK_SERVER_URL}/users`,
  posts: `${MOCK_SERVER_URL}/posts`,
  todos: `${MOCK_SERVER_URL}/todos`,
  userPosts: (userId: number) => `${MOCK_SERVER_URL}/posts?userId=${userId}`,
  userTodos: (userId: number) => `${MOCK_SERVER_URL}/todos?userId=${userId}`,
}

// Helper function to simulate errors
export const simulateError = (errorRate: number = 0.1): boolean => {
  return Math.random() < errorRate
}

// Helper function to generate new IDs
export const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Mock user generator for async thunk demos
export const generateMockUser = (id: number): User => {
  const names = ['Alex Johnson', 'Sam Wilson', 'Taylor Brown', 'Jordan Davis', 'Casey Miller']
  const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.dev']
  
  const name = names[id % names.length] || `User ${id}`
  const email = `${name.toLowerCase().replace(' ', '.')}@${domains[id % domains.length]}`
  
  return {
    id,
    name,
    email,
    posts: Math.floor(Math.random() * 20) + 1,
    createdAt: new Date().toISOString()
  }
}

// Mock post generator
export const generateMockPost = (userId: number, postId: number): Post => {
  const titles = [
    'Understanding React Hooks',
    'Redux Best Practices',
    'Building Modern Web Apps',
    'JavaScript ES6 Features',
    'Async Programming Patterns'
  ]
  
  const bodies = [
    'This is a comprehensive guide to understanding the concepts...',
    'Learn the fundamental principles and best practices...',
    'A deep dive into modern development techniques...',
    'Exploring the latest features and improvements...',
    'Practical examples and real-world applications...'
  ]
  
  return {
    id: postId,
    userId,
    title: titles[postId % titles.length],
    body: bodies[postId % bodies.length],
    createdAt: new Date().toISOString()
  }
}