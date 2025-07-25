export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_match_scores: {
        Row: {
          calculated_at: string | null
          compatibility_score: number | null
          factors: Json | null
          id: string
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          calculated_at?: string | null
          compatibility_score?: number | null
          factors?: Json | null
          id?: string
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          calculated_at?: string | null
          compatibility_score?: number | null
          factors?: Json | null
          id?: string
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          conversion_rate: number | null
          id: string
          interactions: number | null
          metadata: Json | null
          platform: Database["public"]["Enums"]["platform_type"] | null
          prompt_id: string
          timestamp: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          conversion_rate?: number | null
          id?: string
          interactions?: number | null
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["platform_type"] | null
          prompt_id: string
          timestamp?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          conversion_rate?: number | null
          id?: string
          interactions?: number | null
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["platform_type"] | null
          prompt_id?: string
          timestamp?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      attractions: {
        Row: {
          admission_fee_thb: number | null
          admission_fee_usd: number | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description_en: string
          description_th: string | null
          duration_hours: number | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name_en: string
          name_th: string | null
          opening_hours: Json | null
          rating_average: number | null
          rating_count: number | null
          short_description_en: string | null
          short_description_th: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          admission_fee_thb?: number | null
          admission_fee_usd?: number | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description_en: string
          description_th?: string | null
          duration_hours?: number | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name_en: string
          name_th?: string | null
          opening_hours?: Json | null
          rating_average?: number | null
          rating_count?: number | null
          short_description_en?: string | null
          short_description_th?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          admission_fee_thb?: number | null
          admission_fee_usd?: number | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description_en?: string
          description_th?: string | null
          duration_hours?: number | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name_en?: string
          name_th?: string | null
          opening_hours?: Json | null
          rating_average?: number | null
          rating_count?: number | null
          short_description_en?: string | null
          short_description_th?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string | null
          booking_type: string
          confirmation_code: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string | null
          id: string
          notes: string | null
          party_size: number | null
          restaurant_id: string | null
          service_id: string | null
          special_requests: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date: string
          booking_time?: string | null
          booking_type: string
          confirmation_code?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string | null
          id?: string
          notes?: string | null
          party_size?: number | null
          restaurant_id?: string | null
          service_id?: string | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string | null
          booking_type?: string
          confirmation_code?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          party_size?: number | null
          restaurant_id?: string | null
          service_id?: string | null
          special_requests?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address_en: string | null
          address_th: string
          code: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          location_coordinates: unknown | null
          manager_id: string | null
          name_en: string
          name_th: string
          operating_hours: Json | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address_en?: string | null
          address_th: string
          code: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location_coordinates?: unknown | null
          manager_id?: string | null
          name_en: string
          name_th: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address_en?: string | null
          address_th?: string
          code?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location_coordinates?: unknown | null
          manager_id?: string | null
          name_en?: string
          name_th?: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_ads: {
        Row: {
          ad_description: string | null
          ad_image_url: string | null
          ad_title: string
          ad_type: string | null
          advertiser_id: string | null
          business_name: string
          clicks: number | null
          created_at: string | null
          duration_days: number | null
          end_date: string | null
          id: string
          impressions: number | null
          is_active: boolean | null
          payment_status: string | null
          placement: string | null
          price_thb: number
          start_date: string | null
          stripe_payment_id: string | null
          target_url: string | null
          updated_at: string | null
        }
        Insert: {
          ad_description?: string | null
          ad_image_url?: string | null
          ad_title: string
          ad_type?: string | null
          advertiser_id?: string | null
          business_name: string
          clicks?: number | null
          created_at?: string | null
          duration_days?: number | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          payment_status?: string | null
          placement?: string | null
          price_thb: number
          start_date?: string | null
          stripe_payment_id?: string | null
          target_url?: string | null
          updated_at?: string | null
        }
        Update: {
          ad_description?: string | null
          ad_image_url?: string | null
          ad_title?: string
          ad_type?: string | null
          advertiser_id?: string | null
          business_name?: string
          clicks?: number | null
          created_at?: string | null
          duration_days?: number | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          payment_status?: string | null
          placement?: string | null
          price_thb?: number
          start_date?: string | null
          stripe_payment_id?: string | null
          target_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description_en: string | null
          description_th: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_th: string | null
          order_index: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_th?: string | null
          order_index?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_th?: string | null
          order_index?: number | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_replied: boolean | null
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_replied?: boolean | null
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_replied?: boolean | null
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          content_en: string | null
          content_th: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          lesson_type: string | null
          module_id: string | null
          order_index: number
          title_en: string
          title_th: string | null
          video_url: string | null
        }
        Insert: {
          content_en?: string | null
          content_th?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          order_index: number
          title_en: string
          title_th?: string | null
          video_url?: string | null
        }
        Update: {
          content_en?: string | null
          content_th?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          lesson_type?: string | null
          module_id?: string | null
          order_index?: number
          title_en?: string
          title_th?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description_en: string | null
          description_th: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          order_index: number
          title_en: string
          title_th: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index: number
          title_en: string
          title_th?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title_en?: string
          title_th?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string | null
          description_en: string
          description_th: string | null
          difficulty_level: string | null
          discount_percentage: number | null
          duration_hours: number | null
          enrollment_count: number | null
          featured: boolean | null
          id: string
          instructor_id: string | null
          learning_outcomes_en: string[] | null
          learning_outcomes_th: string[] | null
          prerequisites_en: string[] | null
          prerequisites_th: string[] | null
          preview_video_url: string | null
          price_thb: number | null
          price_usd: number | null
          rating_average: number | null
          rating_count: number | null
          short_description_en: string | null
          short_description_th: string | null
          status: string | null
          thumbnail_url: string | null
          title_en: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description_en: string
          description_th?: string | null
          difficulty_level?: string | null
          discount_percentage?: number | null
          duration_hours?: number | null
          enrollment_count?: number | null
          featured?: boolean | null
          id?: string
          instructor_id?: string | null
          learning_outcomes_en?: string[] | null
          learning_outcomes_th?: string[] | null
          prerequisites_en?: string[] | null
          prerequisites_th?: string[] | null
          preview_video_url?: string | null
          price_thb?: number | null
          price_usd?: number | null
          rating_average?: number | null
          rating_count?: number | null
          short_description_en?: string | null
          short_description_th?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title_en: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description_en?: string
          description_th?: string | null
          difficulty_level?: string | null
          discount_percentage?: number | null
          duration_hours?: number | null
          enrollment_count?: number | null
          featured?: boolean | null
          id?: string
          instructor_id?: string | null
          learning_outcomes_en?: string[] | null
          learning_outcomes_th?: string[] | null
          prerequisites_en?: string[] | null
          prerequisites_th?: string[] | null
          preview_video_url?: string | null
          price_thb?: number | null
          price_usd?: number | null
          rating_average?: number | null
          rating_count?: number | null
          short_description_en?: string | null
          short_description_th?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title_en?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_scores: {
        Row: {
          calculated_at: string | null
          created_at: string | null
          customer_id: string | null
          expires_at: string | null
          id: string
          max_loan_amount: number
          recommended_down_payment_percentage: number | null
          risk_level: string
          score: number
          score_factors: Json | null
        }
        Insert: {
          calculated_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          max_loan_amount: number
          recommended_down_payment_percentage?: number | null
          risk_level: string
          score: number
          score_factors?: Json | null
        }
        Update: {
          calculated_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          max_loan_amount?: number
          recommended_down_payment_percentage?: number | null
          risk_level?: string
          score?: number
          score_factors?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_scores_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          id_card_number: string | null
          last_name: string
          loyalty_tier: string | null
          monthly_income: number | null
          occupation: string | null
          phone: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          id_card_number?: string | null
          last_name: string
          loyalty_tier?: string | null
          monthly_income?: number | null
          occupation?: string | null
          phone: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          id_card_number?: string | null
          last_name?: string
          loyalty_tier?: string | null
          monthly_income?: number | null
          occupation?: string | null
          phone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_sessions: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          login_at: string | null
          logout_at: string | null
          station_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          login_at?: string | null
          logout_at?: string | null
          station_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          login_at?: string | null
          logout_at?: string | null
          station_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_sessions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_sessions_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "fuel_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          id: string
          progress: number | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          progress?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string
          event_id: string
          id: string
          is_host: boolean | null
          joined_at: string | null
          left_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          is_host?: boolean | null
          joined_at?: string | null
          left_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          event_type: string
          host_id: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          room_code: string | null
          start_time: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          host_id: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          room_code?: string | null
          start_time: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          host_id?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          room_code?: string | null
          start_time?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          details: Json | null
          id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_pumps: {
        Row: {
          created_at: string | null
          fuel_type: string
          id: string
          is_active: boolean | null
          price_per_liter: number
          pump_number: string
          qr_code_data: string | null
          station_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fuel_type: string
          id?: string
          is_active?: boolean | null
          price_per_liter: number
          pump_number: string
          qr_code_data?: string | null
          station_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fuel_type?: string
          id?: string
          is_active?: boolean | null
          price_per_liter?: number
          pump_number?: string
          qr_code_data?: string | null
          station_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_pumps_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "fuel_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_stations: {
        Row: {
          address: string
          created_at: string | null
          fuel_types: Json | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          fuel_types?: Json | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          fuel_types?: Json | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fuel_transactions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          employee_id: string | null
          fuel_type: string
          id: string
          liters: number
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          payment_verified_at: string | null
          price_per_liter: number
          promptpay_id: string | null
          pump_id: string
          qr_code_payload: string | null
          receipt_url: string | null
          session_id: string | null
          started_at: string | null
          total_amount: number
          transaction_code: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          fuel_type: string
          id?: string
          liters: number
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          payment_verified_at?: string | null
          price_per_liter: number
          promptpay_id?: string | null
          pump_id: string
          qr_code_payload?: string | null
          receipt_url?: string | null
          session_id?: string | null
          started_at?: string | null
          total_amount: number
          transaction_code: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          fuel_type?: string
          id?: string
          liters?: number
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          payment_verified_at?: string | null
          price_per_liter?: number
          promptpay_id?: string | null
          pump_id?: string
          qr_code_payload?: string | null
          receipt_url?: string | null
          session_id?: string | null
          started_at?: string | null
          total_amount?: number
          transaction_code?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_transactions_pump_id_fkey"
            columns: ["pump_id"]
            isOneToOne: false
            referencedRelation: "fuel_pumps"
            referencedColumns: ["id"]
          },
        ]
      }
      group_chat_members: {
        Row: {
          created_at: string
          group_id: string
          id: string
          is_muted: boolean | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          is_muted?: boolean | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_chat_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          is_deleted: boolean | null
          media_url: string | null
          message_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          is_deleted?: boolean | null
          media_url?: string | null
          message_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          is_deleted?: boolean | null
          media_url?: string | null
          message_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      group_chats: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          max_members: number | null
          name: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          max_members?: number | null
          name: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          max_members?: number | null
          name?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      installment_applications: {
        Row: {
          application_number: string
          applied_promotions: string[] | null
          approved_at: string | null
          approved_by: string | null
          branch_id: string | null
          created_at: string | null
          created_by: string
          customer_id: string
          down_payment: number
          id: string
          installment_months: number
          interest_rate: number | null
          loan_amount: number
          monthly_payment: number
          notes: string | null
          product_id: string
          product_price: number
          rejected_reason: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          total_discount: number | null
          updated_at: string | null
        }
        Insert: {
          application_number: string
          applied_promotions?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          branch_id?: string | null
          created_at?: string | null
          created_by: string
          customer_id: string
          down_payment: number
          id?: string
          installment_months: number
          interest_rate?: number | null
          loan_amount: number
          monthly_payment: number
          notes?: string | null
          product_id: string
          product_price: number
          rejected_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          total_discount?: number | null
          updated_at?: string | null
        }
        Update: {
          application_number?: string
          applied_promotions?: string[] | null
          approved_at?: string | null
          approved_by?: string | null
          branch_id?: string | null
          created_at?: string | null
          created_by?: string
          customer_id?: string
          down_payment?: number
          id?: string
          installment_months?: number
          interest_rate?: number | null
          loan_amount?: number
          monthly_payment?: number
          notes?: string | null
          product_id?: string
          product_price?: number
          rejected_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          total_discount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installment_applications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_applications_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_applications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_applications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_applications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      installment_payments: {
        Row: {
          amount_due: number
          amount_paid: number | null
          application_id: string
          created_at: string | null
          due_date: string
          id: string
          late_fee: number | null
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_number: number
          payment_reference: string | null
          processed_by: string | null
          qr_code_data: string | null
          qr_code_expires_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          application_id: string
          created_at?: string | null
          due_date: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_number: number
          payment_reference?: string | null
          processed_by?: string | null
          qr_code_data?: string | null
          qr_code_expires_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          application_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          late_fee?: number | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_number?: number
          payment_reference?: string | null
          processed_by?: string | null
          qr_code_data?: string | null
          qr_code_expires_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installment_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "installment_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installment_payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors: {
        Row: {
          bio_en: string | null
          bio_th: string | null
          created_at: string | null
          expertise: string[] | null
          id: string
          is_featured: boolean | null
          social_links: Json | null
          updated_at: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          bio_en?: string | null
          bio_th?: string | null
          created_at?: string | null
          expertise?: string[] | null
          id?: string
          is_featured?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          bio_en?: string | null
          bio_th?: string | null
          created_at?: string | null
          expertise?: string[] | null
          id?: string
          is_featured?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_deadline: string | null
          category: string | null
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description_en: string
          description_th: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          job_type: string | null
          location: string | null
          posted_by: string | null
          requirements_en: string[] | null
          requirements_th: string[] | null
          salary_max_thb: number | null
          salary_max_usd: number | null
          salary_min_thb: number | null
          salary_min_usd: number | null
          title_en: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          category?: string | null
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description_en: string
          description_th?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements_en?: string[] | null
          requirements_th?: string[] | null
          salary_max_thb?: number | null
          salary_max_usd?: number | null
          salary_min_thb?: number | null
          salary_min_usd?: number | null
          title_en: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          category?: string | null
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description_en?: string
          description_th?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements_en?: string[] | null
          requirements_th?: string[] | null
          salary_max_thb?: number | null
          salary_max_usd?: number | null
          salary_min_thb?: number | null
          salary_min_usd?: number | null
          title_en?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_programs: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          last_activity_at: string | null
          points_balance: number | null
          tier_level: string | null
          total_points_earned: number | null
          total_points_redeemed: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          last_activity_at?: string | null
          points_balance?: number | null
          tier_level?: string | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          last_activity_at?: string | null
          points_balance?: number | null
          tier_level?: string | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          matched_at: string | null
          status: Database["public"]["Enums"]["match_status"] | null
          updated_at: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          matched_at?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          matched_at?: string | null
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          match_id: string | null
          media_url: string | null
          message_type: string | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          match_id?: string | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          match_id?: string | null
          media_url?: string | null
          message_type?: string | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          content_en: string
          content_th: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_th: string
          notification_type: string
          subject_en: string | null
          subject_th: string | null
          template_key: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content_en: string
          content_th: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_th: string
          notification_type: string
          subject_en?: string | null
          subject_th?: string | null
          template_key: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content_en?: string
          content_th?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_th?: string
          notification_type?: string
          subject_en?: string | null
          subject_th?: string | null
          template_key?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_en: string
          message_th: string | null
          title_en: string
          title_th: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_en: string
          message_th?: string | null
          title_en: string
          title_th?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_en?: string
          message_th?: string | null
          title_en?: string
          title_th?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          bank_callback_data: Json | null
          bank_reference: string | null
          created_at: string | null
          currency: string | null
          id: string
          installment_payment_id: string | null
          qr_code_payload: Json | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          amount: number
          bank_callback_data?: Json | null
          bank_reference?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          installment_payment_id?: string | null
          qr_code_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          amount?: number
          bank_callback_data?: Json | null
          bank_reference?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          installment_payment_id?: string | null
          qr_code_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_installment_payment_id_fkey"
            columns: ["installment_payment_id"]
            isOneToOne: false
            referencedRelation: "installment_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          enrollment_id: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          slip_image_url: string | null
          transaction_reference: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          enrollment_id: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          slip_image_url?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          enrollment_id?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          slip_image_url?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_integrations: {
        Row: {
          api_key: string | null
          config: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: Database["public"]["Enums"]["platform_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      playlist_tracks: {
        Row: {
          created_at: string | null
          id: string
          playlist_id: string | null
          position: number
          track_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          playlist_id?: string | null
          position: number
          track_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          playlist_id?: string | null
          position?: number
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_th: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_th: string
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_th: string
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_th?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          branch_id: string | null
          brand: string
          category_id: string | null
          cost_price_thb: number | null
          created_at: string | null
          created_by: string | null
          description_en: string | null
          description_th: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          min_stock_level: number | null
          model: string
          name_en: string
          name_th: string
          price_thb: number
          serial_number: string | null
          stock_quantity: number | null
          updated_at: string | null
          warranty_months: number | null
        }
        Insert: {
          barcode?: string | null
          branch_id?: string | null
          brand: string
          category_id?: string | null
          cost_price_thb?: number | null
          created_at?: string | null
          created_by?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock_level?: number | null
          model: string
          name_en: string
          name_th: string
          price_thb: number
          serial_number?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          warranty_months?: number | null
        }
        Update: {
          barcode?: string | null
          branch_id?: string | null
          brand?: string
          category_id?: string | null
          cost_price_thb?: number | null
          created_at?: string | null
          created_by?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          min_stock_level?: number | null
          model?: string
          name_en?: string
          name_th?: string
          price_thb?: number
          serial_number?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          warranty_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          employee_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"] | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          employee_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"] | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          employee_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"] | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          applicable_categories: string[] | null
          applicable_products: string[] | null
          created_at: string | null
          created_by: string | null
          description_en: string | null
          description_th: string | null
          end_date: string
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_purchase_amount: number | null
          name_en: string
          name_th: string
          promotion_type: string
          start_date: string
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description_en?: string | null
          description_th?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name_en: string
          name_th: string
          promotion_type: string
          start_date: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          value: number
        }
        Update: {
          applicable_categories?: string[] | null
          applicable_products?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description_en?: string | null
          description_th?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          name_en?: string
          name_th?: string
          promotion_type?: string
          start_date?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_favorite: boolean | null
          is_public: boolean | null
          platform: Database["public"]["Enums"]["platform_type"] | null
          status: Database["public"]["Enums"]["prompt_status"] | null
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          platform?: Database["public"]["Enums"]["platform_type"] | null
          status?: Database["public"]["Enums"]["prompt_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          is_public?: boolean | null
          platform?: Database["public"]["Enums"]["platform_type"] | null
          status?: Database["public"]["Enums"]["prompt_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: []
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: number
          token: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: number
          token: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: number
          token?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address_en: string | null
          address_th: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          cuisine_type: string
          delivery_available: boolean | null
          description_en: string
          description_th: string | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name_en: string
          name_th: string | null
          opening_hours: Json | null
          price_range: string | null
          rating_average: number | null
          rating_count: number | null
          reservation_required: boolean | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address_en?: string | null
          address_th?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          cuisine_type: string
          delivery_available?: boolean | null
          description_en: string
          description_th?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name_en: string
          name_th?: string | null
          opening_hours?: Json | null
          price_range?: string | null
          rating_average?: number | null
          rating_count?: number | null
          reservation_required?: boolean | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address_en?: string | null
          address_th?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          cuisine_type?: string
          delivery_available?: boolean | null
          description_en?: string
          description_th?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name_en?: string
          name_th?: string | null
          opening_hours?: Json | null
          price_range?: string | null
          rating_average?: number | null
          rating_count?: number | null
          reservation_required?: boolean | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          attraction_id: string | null
          created_at: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_verified: boolean | null
          rating: number
          restaurant_id: string | null
          review_text: string | null
          service_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attraction_id?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating: number
          restaurant_id?: string | null
          review_text?: string | null
          service_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attraction_id?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number
          restaurant_id?: string | null
          review_text?: string | null
          service_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "attractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          availability: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description_en: string
          description_th: string | null
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          name_en: string
          name_th: string | null
          price_thb: number | null
          price_usd: number | null
          provider_name: string | null
          rating_average: number | null
          rating_count: number | null
          service_type: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          availability?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description_en: string
          description_th?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          name_en: string
          name_th?: string | null
          price_thb?: number | null
          price_usd?: number | null
          provider_name?: string | null
          rating_average?: number | null
          rating_count?: number | null
          service_type: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          availability?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description_en?: string
          description_th?: string | null
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          name_en?: string
          name_th?: string | null
          price_thb?: number | null
          price_usd?: number | null
          provider_name?: string | null
          rating_average?: number | null
          rating_count?: number | null
          service_type?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      social_media_connections: {
        Row: {
          access_token: string | null
          connected_at: string | null
          id: string
          is_active: boolean | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_user_id: string
          platform_username: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_user_id: string
          platform_username?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: Database["public"]["Enums"]["social_platform"]
          platform_user_id?: string
          platform_username?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suspicious_activities: {
        Row: {
          activity_type: string
          auto_detected: boolean | null
          created_at: string | null
          description: string | null
          employee_id: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          activity_type: string
          auto_detected?: boolean | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          activity_type?: string
          auto_detected?: boolean | null
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suspicious_activities_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suspicious_activities_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suspicious_activities_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "fuel_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_actions: {
        Row: {
          created_at: string | null
          id: string
          is_like: boolean
          swiped_id: string | null
          swiper_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_like: boolean
          swiped_id?: string | null
          swiper_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_like?: boolean
          swiped_id?: string | null
          swiper_id?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message_en: string
          message_th: string
          severity: string | null
          target_role: Database["public"]["Enums"]["employee_role"] | null
          target_user_id: string | null
          title_en: string
          title_th: string
          type: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message_en: string
          message_th: string
          severity?: string | null
          target_role?: Database["public"]["Enums"]["employee_role"] | null
          target_user_id?: string | null
          title_en: string
          title_th: string
          type: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message_en?: string
          message_th?: string
          severity?: string | null
          target_role?: Database["public"]["Enums"]["employee_role"] | null
          target_user_id?: string | null
          title_en?: string
          title_th?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description_en: string | null
          description_th: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      table_name: {
        Row: {
          data: Json | null
          id: number
          inserted_at: string
          name: string | null
          updated_at: string
        }
        Insert: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          data?: Json | null
          id?: number
          inserted_at?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          album: string | null
          artist: string
          cover_url: string | null
          created_at: string | null
          duration: number
          id: string
          title: string
          url: string
          user_id: string | null
          waveform_data: Json | null
        }
        Insert: {
          album?: string | null
          artist: string
          cover_url?: string | null
          created_at?: string | null
          duration: number
          id?: string
          title: string
          url: string
          user_id?: string | null
          waveform_data?: Json | null
        }
        Update: {
          album?: string | null
          artist?: string
          cover_url?: string | null
          created_at?: string | null
          duration?: number
          id?: string
          title?: string
          url?: string
          user_id?: string | null
          waveform_data?: Json | null
        }
        Relationships: []
      }
      transaction_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          employee_id: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_by: string[] | null
          severity: string | null
          station_id: string | null
          target_roles: Database["public"]["Enums"]["employee_role"][] | null
          title: string
          transaction_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_by?: string[] | null
          severity?: string | null
          station_id?: string | null
          target_roles?: Database["public"]["Enums"]["employee_role"][] | null
          title: string
          transaction_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_by?: string[] | null
          severity?: string | null
          station_id?: string | null
          target_roles?: Database["public"]["Enums"]["employee_role"][] | null
          title?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_alerts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_alerts_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "fuel_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_alerts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "fuel_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expires_at: string | null
          id: string
          payment_method: string | null
          promptpay_id: string | null
          qr_code_data: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          promptpay_id?: string | null
          qr_code_data?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          promptpay_id?: string | null
          qr_code_data?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          max_age: number | null
          max_distance: number | null
          min_age: number | null
          preferred_gender: Database["public"]["Enums"]["user_gender"][] | null
          show_me_on_discovery: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_age?: number | null
          max_distance?: number | null
          min_age?: number | null
          preferred_gender?: Database["public"]["Enums"]["user_gender"][] | null
          show_me_on_discovery?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_age?: number | null
          max_distance?: number | null
          min_age?: number | null
          preferred_gender?: Database["public"]["Enums"]["user_gender"][] | null
          show_me_on_discovery?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number
          bio: string | null
          created_at: string | null
          display_name: string | null
          education: string | null
          full_name: string
          gender: Database["public"]["Enums"]["user_gender"]
          height: number | null
          id: string
          interests: string[] | null
          is_active: boolean | null
          is_verified: boolean | null
          last_active: string | null
          location: string | null
          occupation: string | null
          profile_images: string[] | null
          profile_video_url: string | null
          subscription_expires_at: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age: number
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          education?: string | null
          full_name: string
          gender: Database["public"]["Enums"]["user_gender"]
          height?: number | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active?: string | null
          location?: string | null
          occupation?: string | null
          profile_images?: string[] | null
          profile_video_url?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          education?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["user_gender"]
          height?: number | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active?: string | null
          location?: string | null
          occupation?: string | null
          profile_images?: string[] | null
          profile_video_url?: string | null
          subscription_expires_at?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          expires_at: string | null
          feature_name: string
          id: string
          payment_status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          feature_name: string
          id?: string
          payment_status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          feature_name?: string
          id?: string
          payment_status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string
          reported_id: string | null
          reporter_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason: string
          reported_id?: string | null
          reporter_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string
          reported_id?: string | null
          reporter_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          last_login_at: string | null
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          last_login_at?: string | null
          password_hash: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          last_login_at?: string | null
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      stripe_user_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string | null
          currency: string | null
          customer_id: string | null
          order_date: string | null
          order_id: number | null
          order_status:
            | Database["public"]["Enums"]["stripe_order_status"]
            | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Relationships: []
      }
      stripe_user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["stripe_subscription_status"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_application_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected" | "completed"
      course_status: "draft" | "published" | "archived"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      employee_role: "employee" | "manager" | "admin"
      enrollment_status: "pending" | "active" | "completed" | "cancelled"
      installment_status: "active" | "completed" | "defaulted" | "cancelled"
      match_status: "pending" | "matched" | "rejected" | "blocked"
      message_status: "sent" | "delivered" | "read"
      payment_method:
        | "bank_transfer"
        | "credit_card"
        | "promptpay"
        | "online_banking"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      platform_type: "lovable" | "bolt" | "cursor" | "windsurf" | "custom"
      prompt_status: "draft" | "published" | "archived"
      social_platform: "facebook" | "instagram" | "tiktok" | "twitter"
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      subscription_status: "free" | "pro" | "enterprise"
      subscription_tier: "free" | "premium" | "vip"
      user_gender: "male" | "female" | "non_binary" | "prefer_not_to_say"
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
      application_status: ["pending", "approved", "rejected", "completed"],
      course_status: ["draft", "published", "archived"],
      difficulty_level: ["beginner", "intermediate", "advanced"],
      employee_role: ["employee", "manager", "admin"],
      enrollment_status: ["pending", "active", "completed", "cancelled"],
      installment_status: ["active", "completed", "defaulted", "cancelled"],
      match_status: ["pending", "matched", "rejected", "blocked"],
      message_status: ["sent", "delivered", "read"],
      payment_method: [
        "bank_transfer",
        "credit_card",
        "promptpay",
        "online_banking",
      ],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      platform_type: ["lovable", "bolt", "cursor", "windsurf", "custom"],
      prompt_status: ["draft", "published", "archived"],
      social_platform: ["facebook", "instagram", "tiktok", "twitter"],
      stripe_order_status: ["pending", "completed", "canceled"],
      stripe_subscription_status: [
        "not_started",
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
      subscription_status: ["free", "pro", "enterprise"],
      subscription_tier: ["free", "premium", "vip"],
      user_gender: ["male", "female", "non_binary", "prefer_not_to_say"],
    },
  },
} as const
