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
      buyers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      carts: {
        Row: {
          created_at: string
          id: string
          price_at_add: number
          product_id: string
          quantity: number
          user_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          price_at_add: number
          product_id: string
          quantity?: number
          user_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          price_at_add?: number
          product_id?: string
          quantity?: number
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_requests: {
        Row: {
          ai_preview_image_url: string | null
          ai_preview_notes: string | null
          brief_photos: string[] | null
          brief_text: string
          budget: number | null
          buyer_id: string
          created_at: string
          id: string
          materials: string | null
          product_id: string | null
          quote_amount: number | null
          quote_milestones: Json | null
          quote_timeline_days: number | null
          seller_id: string | null
          status: string | null
          timeline_days: number | null
          updated_at: string
        }
        Insert: {
          ai_preview_image_url?: string | null
          ai_preview_notes?: string | null
          brief_photos?: string[] | null
          brief_text: string
          budget?: number | null
          buyer_id: string
          created_at?: string
          id?: string
          materials?: string | null
          product_id?: string | null
          quote_amount?: number | null
          quote_milestones?: Json | null
          quote_timeline_days?: number | null
          seller_id?: string | null
          status?: string | null
          timeline_days?: number | null
          updated_at?: string
        }
        Update: {
          ai_preview_image_url?: string | null
          ai_preview_notes?: string | null
          brief_photos?: string[] | null
          brief_text?: string
          budget?: number | null
          buyer_id?: string
          created_at?: string
          id?: string
          materials?: string | null
          product_id?: string | null
          quote_amount?: number | null
          quote_milestones?: Json | null
          quote_timeline_days?: number | null
          seller_id?: string | null
          status?: string | null
          timeline_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_requests_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_works: {
        Row: {
          created_at: string
          id: string
          outcome_notes: string | null
          photos: string[] | null
          seller_id: string
          story: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          outcome_notes?: string | null
          photos?: string[] | null
          seller_id: string
          story?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          outcome_notes?: string | null
          photos?: string[] | null
          seller_id?: string
          story?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_works_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          audio_url: string | null
          created_at: string
          from_user_id: string
          id: string
          text: string | null
          thread_id: string
          thread_type: string
        }
        Insert: {
          attachments?: string[] | null
          audio_url?: string | null
          created_at?: string
          from_user_id: string
          id?: string
          text?: string | null
          thread_id: string
          thread_type: string
        }
        Update: {
          attachments?: string[] | null
          audio_url?: string | null
          created_at?: string
          from_user_id?: string
          id?: string
          text?: string | null
          thread_id?: string
          thread_type?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          expires_at: string | null
          first_order_only: boolean | null
          id: string
          min_cart_amount: number | null
          seller_id: string | null
          type: string
          value: number
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          expires_at?: string | null
          first_order_only?: boolean | null
          id?: string
          min_cart_amount?: number | null
          seller_id?: string | null
          type: string
          value: number
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          expires_at?: string | null
          first_order_only?: boolean | null
          id?: string
          min_cart_amount?: number | null
          seller_id?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          custom_request_id: string | null
          discount: number | null
          id: string
          items: Json
          payment_method: string | null
          payment_status: string | null
          seller_id: string
          shipping: number | null
          shipping_address: Json | null
          status: string | null
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          custom_request_id?: string | null
          discount?: number | null
          id?: string
          items: Json
          payment_method?: string | null
          payment_status?: string | null
          seller_id: string
          shipping?: number | null
          shipping_address?: Json | null
          status?: string | null
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          custom_request_id?: string | null
          discount?: number | null
          id?: string
          items?: Json
          payment_method?: string | null
          payment_status?: string | null
          seller_id?: string
          shipping?: number | null
          shipping_address?: Json | null
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      points_ledger: {
        Row: {
          created_at: string
          id: string
          note: string | null
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_ledger_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          cultural_badge: boolean | null
          description: string | null
          eco_badge: boolean | null
          id: string
          photos: string[] | null
          price: number
          published: boolean | null
          seller_id: string
          stock: number | null
          story_audio_url: string | null
          story_language: string | null
          story_text: string | null
          tags: string[] | null
          title: string
          updated_at: string
          variants: Json | null
        }
        Insert: {
          created_at?: string
          cultural_badge?: boolean | null
          description?: string | null
          eco_badge?: boolean | null
          id?: string
          photos?: string[] | null
          price: number
          published?: boolean | null
          seller_id: string
          stock?: number | null
          story_audio_url?: string | null
          story_language?: string | null
          story_text?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          variants?: Json | null
        }
        Update: {
          created_at?: string
          cultural_badge?: boolean | null
          description?: string | null
          eco_badge?: boolean | null
          id?: string
          photos?: string[] | null
          price?: number
          published?: boolean | null
          seller_id?: string
          stock?: number | null
          story_audio_url?: string | null
          story_language?: string | null
          story_text?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          variants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          kyc_status: string | null
          language: string | null
          phone: string | null
          photo_url: string | null
          points: number | null
          referral_code: string | null
          role: string
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          kyc_status?: string | null
          language?: string | null
          phone?: string | null
          photo_url?: string | null
          points?: number | null
          referral_code?: string | null
          role?: string
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          kyc_status?: string | null
          language?: string | null
          phone?: string | null
          photo_url?: string | null
          points?: number | null
          referral_code?: string | null
          role?: string
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          status: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          status?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          status?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      sellers: {
        Row: {
          bio: string | null
          created_at: string
          cultural_badge: boolean | null
          eco_badge: boolean | null
          id: string
          rating: number | null
          region: string | null
          shop_name: string
          style_profile: Json | null
          total_sales: number | null
          updated_at: string
          user_id: string
          verified_badge: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          cultural_badge?: boolean | null
          eco_badge?: boolean | null
          id?: string
          rating?: number | null
          region?: string | null
          shop_name: string
          style_profile?: Json | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          verified_badge?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          cultural_badge?: boolean | null
          eco_badge?: boolean | null
          id?: string
          rating?: number | null
          region?: string | null
          shop_name?: string
          style_profile?: Json | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          verified_badge?: boolean | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
