/*
  # Initial schema setup for cake store

  1. New Tables
    - `cakes`: Stores cake information
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `images` (text[])
      - `featured` (boolean)
      - `created_at` (timestamp)
    
    - `enquiries`: Stores customer enquiries
      - `id` (uuid, primary key)
      - `cake_id` (uuid, foreign key to cakes)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)
    
    - `profiles`: Stores admin profiles
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Set up policies for public and authenticated access
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
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

-- Policies for enquiries
CREATE POLICY "Anyone can create enquiries"
  ON enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

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