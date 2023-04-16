export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

type LevelRole = {
  role_id: string;
  level: number;
};

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      member: {
        Row: {
          id: number;
          last_message_timestamp: number;
          last_pat_timestamp: number;
          level: number;
          member_id: string;
          message: number;
          pat: number;
          server_id: string;
          xp: number;
        };
        Insert: {
          id?: number;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          member_id: string;
          message?: number;
          pat?: number;
          server_id: string;
          xp?: number;
        };
        Update: {
          id?: number;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          member_id?: string;
          message?: number;
          pat?: number;
          server_id?: string;
          xp?: number;
        };
      };
      server: {
        Row: {
          id: number;
          level_message_channel: string | null;
          level_message_channels: string[];
          level_ranks: LevelRole[];
          mod_id: string | null;
          mod_log_channel: string | null;
          pat: number;
          server_id: string;
        };
        Insert: {
          id?: number;
          level_message_channel?: string | null;
          level_message_channels?: string[];
          level_ranks?: LevelRole[];
          mod_id?: string | null;
          mod_log_channel?: string | null;
          pat?: number;
          server_id: string;
        };
        Update: {
          id?: number;
          level_message_channel?: string | null;
          level_message_channels?: string[];
          level_ranks?: LevelRole[];
          mod_id?: string | null;
          mod_log_channel?: string | null;
          pat?: number;
          server_id?: string;
        };
      };
      warning: {
        Row: {
          id: string;
          member_id: string;
          mod_id: string;
          reason: string;
          server_id: string;
          timestamp: number;
        };
        Insert: {
          id?: string;
          member_id: string;
          mod_id: string;
          reason: string;
          server_id: string;
          timestamp: number;
        };
        Update: {
          id?: string;
          member_id?: string;
          mod_id?: string;
          reason?: string;
          server_id?: string;
          timestamp?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Member = Database['public']['Tables']['member']['Row'];
export type Server = Database['public']['Tables']['server']['Row'];
export type Warning = Database['public']['Tables']['warning']['Row'];
