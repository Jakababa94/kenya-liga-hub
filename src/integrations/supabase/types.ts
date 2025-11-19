export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string
          created_at: string | null
          home_score: number | null
          home_team_id: string
          id: string
          match_group: string | null
          round: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["match_status"]
          tournament_id: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id: string
          created_at?: string | null
          home_score?: number | null
          home_team_id: string
          id?: string
          match_group?: string | null
          round?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["match_status"]
          tournament_id: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string
          id?: string
          match_group?: string | null
          round?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["match_status"]
          tournament_id?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          phone_number: string
          registration_id: string
          result_code: string | null
          result_desc: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          phone_number: string
          registration_id: string
          result_code?: string | null
          result_desc?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          phone_number?: string
          registration_id?: string
          result_code?: string | null
          result_desc?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "tournament_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          preferred_language: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      standings: {
        Row: {
          created_at: string | null
          drawn: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string
          lost: number | null
          played: number | null
          points: number | null
          team_id: string
          tournament_id: string
          updated_at: string | null
          won: number | null
        }
        Insert: {
          created_at?: string | null
          drawn?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          lost?: number | null
          played?: number | null
          points?: number | null
          team_id: string
          tournament_id: string
          updated_at?: string | null
          won?: number | null
        }
        Update: {
          created_at?: string | null
          drawn?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          lost?: number | null
          played?: number | null
          points?: number | null
          team_id?: string
          tournament_id?: string
          updated_at?: string | null
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          jersey_number: number | null
          joined_at: string
          position: string | null
          role: Database["public"]["Enums"]["team_member_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          jersey_number?: number | null
          joined_at?: string
          position?: string | null
          role?: Database["public"]["Enums"]["team_member_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          jersey_number?: number | null
          joined_at?: string
          position?: string | null
          role?: Database["public"]["Enums"]["team_member_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_id: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
          tournament_id: string | null
          updated_at: string
        }
        Insert: {
          captain_id: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          tournament_id?: string | null
          updated_at?: string
        }
        Update: {
          captain_id?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          tournament_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registrations: {
        Row: {
          id: string
          notes: string | null
          registered_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["registration_status"]
          team_id: string
          tournament_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          registered_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          team_id: string
          tournament_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          registered_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          team_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          category: Database["public"]["Enums"]["tournament_category"]
          created_at: string
          currency: string
          description: string | null
          end_date: string
          entry_fee: number
          id: string
          max_players_per_team: number | null
          max_teams: number
          min_players_per_team: number | null
          min_teams: number | null
          name: string
          organizer_id: string
          region: Database["public"]["Enums"]["kenya_region"]
          registration_deadline: string
          start_date: string
          status: Database["public"]["Enums"]["tournament_status"]
          updated_at: string
          venue: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tournament_category"]
          created_at?: string
          currency?: string
          description?: string | null
          end_date: string
          entry_fee: number
          id?: string
          max_players_per_team?: number | null
          max_teams: number
          min_players_per_team?: number | null
          min_teams?: number | null
          name: string
          organizer_id: string
          region: Database["public"]["Enums"]["kenya_region"]
          registration_deadline: string
          start_date: string
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
          venue: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tournament_category"]
          created_at?: string
          currency?: string
          description?: string | null
          end_date?: string
          entry_fee?: number
          id?: string
          max_players_per_team?: number | null
          max_teams?: number
          min_players_per_team?: number | null
          min_teams?: number | null
          name?: string
          organizer_id?: string
          region?: Database["public"]["Enums"]["kenya_region"]
          registration_deadline?: string
          start_date?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "organizer"
        | "referee"
        | "team_admin"
        | "team_member"
        | "sponsor"
        | "public"
      kenya_region:
        | "nairobi"
        | "central"
        | "coast"
        | "eastern"
        | "north_eastern"
        | "nyanza"
        | "rift_valley"
        | "western"
      match_status:
        | "scheduled"
        | "live"
        | "completed"
        | "postponed"
        | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "cancelled"
      registration_status: "pending" | "approved" | "rejected" | "withdrawn"
      team_member_role: "captain" | "member"
      tournament_category: "u17" | "u21" | "open" | "veterans" | "womens"
      tournament_status:
        | "draft"
        | "published"
        | "registration_open"
        | "registration_closed"
        | "ongoing"
        | "completed"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "organizer",
        "referee",
        "team_admin",
        "team_member",
        "sponsor",
        "public",
      ],
      kenya_region: [
        "nairobi",
        "central",
        "coast",
        "eastern",
        "north_eastern",
        "nyanza",
        "rift_valley",
        "western",
      ],
      match_status: [
        "scheduled",
        "live",
        "completed",
        "postponed",
        "cancelled",
      ],
      payment_status: ["pending", "completed", "failed", "cancelled"],
      registration_status: ["pending", "approved", "rejected", "withdrawn"],
      team_member_role: ["captain", "member"],
      tournament_category: ["u17", "u21", "open", "veterans", "womens"],
      tournament_status: [
        "draft",
        "published",
        "registration_open",
        "registration_closed",
        "ongoing",
        "completed",
        "cancelled",
      ],
    },
  },
} as const
