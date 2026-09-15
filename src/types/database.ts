/** Tipos das tabelas e funções do Supabase (ver supabase/schema.sql). */
export type PlateStatusColumn = "available" | "active" | "disabled";

export type Database = {
  public: {
    Tables: {
      plates: {
        Row: {
          id: string;
          code: string;
          client_name: string | null;
          destination_url: string | null;
          status: PlateStatusColumn;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          client_name?: string | null;
          destination_url?: string | null;
          status?: PlateStatusColumn;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          client_name?: string | null;
          destination_url?: string | null;
          status?: PlateStatusColumn;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      scans: {
        Row: {
          id: string;
          plate_id: string;
          created_at: string;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          plate_id: string;
          created_at?: string;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          plate_id?: string;
          created_at?: string;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "scans_plate_id_fkey";
            columns: ["plate_id"];
            isOneToOne: false;
            referencedRelation: "plates";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      create_plates: {
        Args: { quantity: number };
        Returns: Database["public"]["Tables"]["plates"]["Row"][];
      };
      daily_scans: {
        Args: { days?: number };
        Returns: { day: string; total: number }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
