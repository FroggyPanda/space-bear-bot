export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      member: {
        Row: {
          id: number
          last_message_timestamp: number
          last_pat_timestamp: number
          level: number
          member_id: string
          message: number
          pat: number
          server_id: string
          xp: number
        }
        Insert: {
          id?: number
          last_message_timestamp?: number
          last_pat_timestamp?: number
          level?: number
          member_id: string
          message?: number
          pat?: number
          server_id: string
          xp?: number
        }
        Update: {
          id?: number
          last_message_timestamp?: number
          last_pat_timestamp?: number
          level?: number
          member_id?: string
          message?: number
          pat?: number
          server_id?: string
          xp?: number
        }
      }
      server: {
        Row: {
          id: number
          level_message_channel: string | null
          level_message_channels: string[]
          level_ranks: Json[]
          mod_id: string | null
          mod_log_channel: string | null
          pat: number
          server_id: string
        }
        Insert: {
          id?: number
          level_message_channel?: string | null
          level_message_channels?: string[]
          level_ranks?: Json[]
          mod_id?: string | null
          mod_log_channel?: string | null
          pat?: number
          server_id: string
        }
        Update: {
          id?: number
          level_message_channel?: string | null
          level_message_channels?: string[]
          level_ranks?: Json[]
          mod_id?: string | null
          mod_log_channel?: string | null
          pat?: number
          server_id?: string
        }
      }
      warning: {
        Row: {
          id: string
          member_id: string
          mod_id: string
          reason: string
          server_id: string
          timestamp: number
        }
        Insert: {
          id?: string
          member_id: string
          mod_id: string
          reason: string
          server_id: string
          timestamp: number
        }
        Update: {
          id?: string
          member_id?: string
          mod_id?: string
          reason?: string
          server_id?: string
          timestamp?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
