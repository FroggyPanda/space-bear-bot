export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type LevelRole = {
  role_id: string;
  level: number;
};

export interface Database {
  public: {
    Tables: {
      guild: {
        Row: {
          guild_id: string;
          id: number;
          level_message_channel: string | null;
          level_message_channels: string[];
          level_ranks: LevelRole[];
          mod_id: string | null;
          mod_log_channel: string | null;
          pat: number;
          temporary_channel_category: string | null;
        };
        Insert: {
          guild_id: string;
          id?: number;
          level_message_channel?: string | null;
          level_message_channels?: string[];
          level_ranks?: LevelRole[];
          mod_id?: string | null;
          mod_log_channel?: string | null;
          pat?: number;
          temporary_channel_category?: string | null;
        };
        Update: {
          guild_id?: string;
          id?: number;
          level_message_channel?: string | null;
          level_message_channels?: string[];
          level_ranks?: LevelRole[];
          mod_id?: string | null;
          mod_log_channel?: string | null;
          pat?: number;
          temporary_channel_category?: string | null;
        };
        Relationships: [];
      };
      member: {
        Row: {
          guild_id: string;
          id: number;
          last_message_timestamp: number;
          last_pat_timestamp: number;
          level: number;
          member_id: string;
          message: number;
          pat: number;
          xp: number;
        };
        Insert: {
          guild_id: string;
          id?: number;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          member_id: string;
          message?: number;
          pat?: number;
          xp?: number;
        };
        Update: {
          guild_id?: string;
          id?: number;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          member_id?: string;
          message?: number;
          pat?: number;
          xp?: number;
        };
        Relationships: [];
      };
      new_guild: {
        Row: {
          id: string;
          level_ranks: LevelRole | null;
          mod_log_channel: string | null;
          mod_role_ids: string[] | null;
          pat_count: number;
        };
        Insert: {
          id: string;
          level_ranks?: LevelRole | null;
          mod_log_channel?: string | null;
          mod_role_ids?: string[] | null;
          pat_count?: number;
        };
        Update: {
          id?: string;
          level_ranks?: LevelRole | null;
          mod_log_channel?: string | null;
          mod_role_ids?: string[] | null;
          pat_count?: number;
        };
        Relationships: [];
      };
      new_member: {
        Row: {
          guild_id: string;
          id: string;
          last_message_timestamp: number;
          last_pat_timestamp: number;
          level: number;
          message_count: number;
          pat_count: number;
          xp: number;
        };
        Insert: {
          guild_id: string;
          id: string;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          message_count?: number;
          pat_count?: number;
          xp?: number;
        };
        Update: {
          guild_id?: string;
          id?: string;
          last_message_timestamp?: number;
          last_pat_timestamp?: number;
          level?: number;
          message_count?: number;
          pat_count?: number;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'new_member_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'new_guild';
            referencedColumns: ['id'];
          }
        ];
      };
      new_warning: {
        Row: {
          guild_id: string;
          id: number;
          member_id: string;
          mod_id: string;
          reason: string;
          timestamp: number;
        };
        Insert: {
          guild_id: string;
          id?: number;
          member_id: string;
          mod_id: string;
          reason: string;
          timestamp: number;
        };
        Update: {
          guild_id?: string;
          id?: number;
          member_id?: string;
          mod_id?: string;
          reason?: string;
          timestamp?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'new_warning_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'new_guild';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'new_warning_member_id_fkey';
            columns: ['member_id'];
            isOneToOne: false;
            referencedRelation: 'new_member';
            referencedColumns: ['id'];
          }
        ];
      };
      warning: {
        Row: {
          guild_id: string;
          id: string;
          member_id: string;
          mod_id: string;
          reason: string;
          timestamp: number;
        };
        Insert: {
          guild_id: string;
          id?: string;
          member_id: string;
          mod_id: string;
          reason: string;
          timestamp: number;
        };
        Update: {
          guild_id?: string;
          id?: string;
          member_id?: string;
          mod_id?: string;
          reason?: string;
          timestamp?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'warning_guild_id_fkey';
            columns: ['guild_id'];
            isOneToOne: false;
            referencedRelation: 'guild';
            referencedColumns: ['guild_id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      mood: 'happy' | 'sad';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never;

// Schema: public
// Enums
export enum Mood {
  happy = 'happy',
  sad = 'sad',
}

// Tables
export type Guild = Database['public']['Tables']['guild']['Row'];
export type InsertGuild = Database['public']['Tables']['guild']['Insert'];
export type UpdateGuild = Database['public']['Tables']['guild']['Update'];

export type Member = Database['public']['Tables']['member']['Row'];
export type InsertMember = Database['public']['Tables']['member']['Insert'];
export type UpdateMember = Database['public']['Tables']['member']['Update'];

export type NewGuild = Database['public']['Tables']['new_guild']['Row'];
export type InsertNewGuild =
  Database['public']['Tables']['new_guild']['Insert'];
export type UpdateNewGuild =
  Database['public']['Tables']['new_guild']['Update'];

export type NewMember = Database['public']['Tables']['new_member']['Row'];
export type InsertNewMember =
  Database['public']['Tables']['new_member']['Insert'];
export type UpdateNewMember =
  Database['public']['Tables']['new_member']['Update'];

export type NewWarning = Database['public']['Tables']['new_warning']['Row'];
export type InsertNewWarning =
  Database['public']['Tables']['new_warning']['Insert'];
export type UpdateNewWarning =
  Database['public']['Tables']['new_warning']['Update'];

export type Warning = Database['public']['Tables']['warning']['Row'];
export type InsertWarning = Database['public']['Tables']['warning']['Insert'];
export type UpdateWarning = Database['public']['Tables']['warning']['Update'];
