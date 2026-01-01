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
    PostgrestVersion: "11.2.0 (c820efb)"
  }
  public: {
    Tables: {
      anonymous: {
        Row: {
          anon_name: string | null
          created_at: string
          id: number
          prayers: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          anon_name?: string | null
          created_at?: string
          id?: number
          prayers?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          anon_name?: string | null
          created_at?: string
          id?: number
          prayers?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          answer: string
          created_at: string
          id: number
          question_id: number
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: number
          question_id: number
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          question_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      answers_test: {
        Row: {
          answer: string
          created_at: string
          id: number
          question_id: number
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: number
          question_id: number
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          question_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_test_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_test"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_answers_test_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          created_at: string
          id: number
          posted_by: string
          question: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          posted_by?: string
          question: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          posted_by?: string
          question?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approvals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_user_name_fkey"
            columns: ["user_name"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["full_name"]
          },
        ]
      }
      comments: {
        Row: {
          comment: string
          created_at: string
          id: number
          parent_comment_id: number | null
          prayer_id: number | null
          prayertest_id: number | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          prayer_id?: number | null
          prayertest_id?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          id?: number
          parent_comment_id?: number | null
          prayer_id?: number | null
          prayertest_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_prayertest_id_fkey"
            columns: ["prayertest_id"]
            isOneToOne: false
            referencedRelation: "prayers_test"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devo_likes: {
        Row: {
          created_at: string
          devo_title: string
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          devo_title: string
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          devo_title?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devo_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: number
          message: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          name?: string | null
        }
        Relationships: []
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: number
          prayer_count: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: number
          prayer_count?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: number
          prayer_count?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaway_entries: {
        Row: {
          created_at: string
          email: string
          id: number
          streak: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          streak: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          streak?: number
        }
        Relationships: []
      }
      group_prayers: {
        Row: {
          created_at: string
          group_id: number | null
          id: number
          prayer: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id?: number | null
          id?: number
          prayer: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: number | null
          id?: number
          prayer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_prayers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_prayers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          active_call_id: string | null
          admin_id: string | null
          code: number
          color: string | null
          created_at: string
          description: string | null
          group_img: string | null
          id: number
          is_public: boolean | null
          name: string | null
          start_video_call: boolean | null
        }
        Insert: {
          active_call_id?: string | null
          admin_id?: string | null
          code: number
          color?: string | null
          created_at?: string
          description?: string | null
          group_img?: string | null
          id?: number
          is_public?: boolean | null
          name?: string | null
          start_video_call?: boolean | null
        }
        Update: {
          active_call_id?: string | null
          admin_id?: string | null
          code?: number
          color?: string | null
          created_at?: string
          description?: string | null
          group_img?: string | null
          id?: number
          is_public?: boolean | null
          name?: string | null
          start_video_call?: boolean | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: number
          prayer_id: number | null
          prayertest_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          prayer_id?: number | null
          prayertest_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          prayer_id?: number | null
          prayertest_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_prayertest_id_fkey"
            columns: ["prayertest_id"]
            isOneToOne: false
            referencedRelation: "prayers_test"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      liketable: {
        Row: {
          created_at: string
          id: number
          prayer_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          prayer_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          prayer_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liketable_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liketable_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string
          group_id: number | null
          id: number
          is_admin: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: number | null
          id?: number
          is_admin?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: number | null
          id?: number
          is_admin?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_likes: {
        Row: {
          created_at: string
          id: number
          prayer_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          prayer_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          prayer_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_likes_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_praises: {
        Row: {
          created_at: string
          id: number
          prayer_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          prayer_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          prayer_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_praises_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_praises_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          group_id: number | null
          id: number
          message: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: number | null
          id?: number
          message?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: number | null
          id?: number
          message?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      praises: {
        Row: {
          content: string
          created_at: string
          id: number
          is_praised: boolean
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          is_praised?: boolean
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          is_praised?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "praises_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayers: {
        Row: {
          created_at: string
          disable_response: boolean | null
          id: number
          prayer: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          disable_response?: boolean | null
          id?: number
          prayer: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          disable_response?: boolean | null
          id?: number
          prayer?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayers_test: {
        Row: {
          created_at: string
          disable_response: boolean | null
          id: number
          prayer: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          disable_response?: boolean | null
          id?: number
          prayer: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          disable_response?: boolean | null
          id?: number
          prayer?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayers_test_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin: boolean
          avatar_url: string | null
          email: string | null
          expoToken: string | null
          friend_code: number | null
          full_name: string | null
          id: string
          QuestionsEnabled: boolean | null
          updated_at: string | null
          username: string | null
          VersesEnabled: boolean | null
        }
        Insert: {
          admin?: boolean
          avatar_url?: string | null
          email?: string | null
          expoToken?: string | null
          friend_code?: number | null
          full_name?: string | null
          id: string
          QuestionsEnabled?: boolean | null
          updated_at?: string | null
          username?: string | null
          VersesEnabled?: boolean | null
        }
        Update: {
          admin?: boolean
          avatar_url?: string | null
          email?: string | null
          expoToken?: string | null
          friend_code?: number | null
          full_name?: string | null
          id?: string
          QuestionsEnabled?: boolean | null
          updated_at?: string | null
          username?: string | null
          VersesEnabled?: boolean | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: number
          isNew: boolean | null
          posted_by: string
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          isNew?: boolean | null
          posted_by?: string
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          isNew?: boolean | null
          posted_by?: string
          title?: string | null
        }
        Relationships: []
      }
      questions_test: {
        Row: {
          created_at: string
          id: number
          isNew: boolean | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          isNew?: boolean | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          isNew?: boolean | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_test_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          created_at: string
          devo_title: string
          id: number
          reflection: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          devo_title: string
          id?: number
          reflection: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          devo_title?: string
          id?: number
          reflection?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      typing: {
        Row: {
          created_at: string
          group_id: number | null
          id: number
          is_typing: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: number | null
          id?: number
          is_typing?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: number | null
          id?: number
          is_typing?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "typing_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "typing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      update: {
        Row: {
          created_at: string
          id: number
          isShowingPrayerRoom: boolean | null
          isUpdateAvailable: string
        }
        Insert: {
          created_at?: string
          id?: number
          isShowingPrayerRoom?: boolean | null
          isUpdateAvailable?: string
        }
        Update: {
          created_at?: string
          id?: number
          isShowingPrayerRoom?: boolean | null
          isUpdateAvailable?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete: { Args: never; Returns: undefined }
      delete_all_praises: { Args: never; Returns: undefined }
      "Get all emails": { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
