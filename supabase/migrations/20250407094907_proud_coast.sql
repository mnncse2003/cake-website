/*
  # Initial Schema Setup for Cake Store

  1. New Tables
    - cakes
      - Stores cake information including name, description, category, and images
    - enquiries
      - Stores customer enquiries about cakes
    - profiles
      - Stores admin user profiles

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admins
*/

-- Create cakes table
CREATE TABLE IF NOT EXISTS cakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  images text[] NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cake_id uuid REFERENCES cakes(id),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create profiles table for admins
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for cakes
CREATE POLICY "Anyone can view cakes"
  ON cakes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert cakes"
  ON cakes
  FOR INSERT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

-- Policies for enquiries
CREATE POLICY "Anyone can create enquiries"
  ON enquiries
  FOR INSERT
  TO public
  USING (true);

CREATE POLICY "Only admins can view enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

-- Policies for profiles
CREATE POLICY "Profiles are viewable by admins"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));