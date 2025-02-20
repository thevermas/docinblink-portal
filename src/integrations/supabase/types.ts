export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          address1: string
          address2: string | null
          city: string
          created_at: string
          doctor_id: string | null
          email: string
          fee: number | null
          id: string
          location: string
          medical_history: string | null
          name: string
          needs_ambulance: boolean | null
          phone: string
          pincode: string
          preferred_time: string
          state: string
          status: string | null
          symptoms: string | null
          user_id: string
        }
        Insert: {
          address1: string
          address2?: string | null
          city: string
          created_at?: string
          doctor_id?: string | null
          email: string
          fee?: number | null
          id?: string
          location: string
          medical_history?: string | null
          name: string
          needs_ambulance?: boolean | null
          phone: string
          pincode: string
          preferred_time: string
          state: string
          status?: string | null
          symptoms?: string | null
          user_id: string
        }
        Update: {
          address1?: string
          address2?: string | null
          city?: string
          created_at?: string
          doctor_id?: string | null
          email?: string
          fee?: number | null
          id?: string
          location?: string
          medical_history?: string | null
          name?: string
          needs_ambulance?: boolean | null
          phone?: string
          pincode?: string
          preferred_time?: string
          state?: string
          status?: string | null
          symptoms?: string | null
          user_id?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          allergies: string | null
          created_at: string
          date_of_birth: string | null
          health_issues: string | null
          id: string
          name: string
          relationship: string
          user_id: string
        }
        Insert: {
          allergies?: string | null
          created_at?: string
          date_of_birth?: string | null
          health_issues?: string | null
          id?: string
          name: string
          relationship: string
          user_id: string
        }
        Update: {
          allergies?: string | null
          created_at?: string
          date_of_birth?: string | null
          health_issues?: string | null
          id?: string
          name?: string
          relationship?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          created_at: string
          description: string | null
          doctor_name: string | null
          file_url: string | null
          id: string
          patient_id: string
          record_date: string
          record_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          doctor_name?: string | null
          file_url?: string | null
          id?: string
          patient_id: string
          record_date?: string
          record_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          doctor_name?: string | null
          file_url?: string | null
          id?: string
          patient_id?: string
          record_date?: string
          record_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_patient"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          doctor_id: string
          dosage: string
          duration: string
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          patient_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doctor_id: string
          dosage: string
          duration: string
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          patient_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doctor_id?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          patient_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_doctor: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
