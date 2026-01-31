// This file contains database schema constants for use in JavaScript
// Original TypeScript types have been converted to runtime constants

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "technician", "user"],
    },
  },
};

// Database schema structure (for reference/documentation)
export const DatabaseSchema = {
  public: {
    Tables: {
      user_roles: {
        columns: {
          created_at: 'string',
          id: 'string',
          role: 'app_role', // One of: "admin" | "technician" | "user"
          user_id: 'string'
        }
      }
    },
    Functions: {
      get_user_roles: {
        args: { _user_id: 'string' },
        returns: 'app_role[]'
      },
      has_role: {
        args: {
          _role: 'app_role',
          _user_id: 'string'
        },
        returns: 'boolean'
      }
    },
    Enums: {
      app_role: ["admin", "technician", "user"]
    }
  }
};