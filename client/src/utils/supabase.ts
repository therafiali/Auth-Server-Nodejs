import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Yeh memory me token store karenge (XSS safe, localStorage use mat karo)
let currentToken: string | null = null
export const setAccessToken = (token: string | null) => {
  currentToken = token
}

// Function to decode JWT and get user ID
const getUserIdFromToken = (): string | null => {
  if (!currentToken) return null;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = currentToken.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub; // 'sub' is the standard claim for user ID
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Supabase client with custom accessToken callback
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  accessToken: async () => currentToken ?? '',
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

// Database operations for todos
export const todosApi = {
  // Get all todos for the current user
  async getTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }

    return data || [];
  },

  // Add a new todo
  async addTodo(title: string) {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error('No user ID available from token');
    }
    
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: userId,
          title,
          completed: false,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding todo:', error);
      throw error;
    }

    return data;
  },

  // Update a todo
  async updateTodo(id: string, updates: { title?: string; completed?: boolean }) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating todo:', error);
      throw error;
    }

    return data;
  },

  // Delete a todo
  async deleteTodo(id: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Toggle todo completion
  async toggleTodo(id: string, completed: boolean) {
    return this.updateTodo(id, { completed });
  }
};
