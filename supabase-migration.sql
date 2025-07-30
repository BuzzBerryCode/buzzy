-- Create onboarding_data table
CREATE TABLE IF NOT EXISTS onboarding_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  niche TEXT NOT NULL,
  website TEXT NOT NULL,
  creator_description TEXT NOT NULL,
  audience_size TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_onboarding_data_user_id ON onboarding_data(user_id);

-- Enable Row Level Security
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own onboarding data
CREATE POLICY "Users can view own onboarding data" ON onboarding_data
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own onboarding data
CREATE POLICY "Users can insert own onboarding data" ON onboarding_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own onboarding data
CREATE POLICY "Users can update own onboarding data" ON onboarding_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_onboarding_data_updated_at 
  BEFORE UPDATE ON onboarding_data 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 