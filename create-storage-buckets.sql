-- Create Storage Buckets for FitGenius
-- Run this in Supabase SQL Editor

-- Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create workout-videos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'workout-videos',
  'workout-videos',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- Create meal-photos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meal-photos',
  'meal-photos',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create progress-photos bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'progress-photos',
  'progress-photos',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Set up RLS policies for workout-videos bucket
CREATE POLICY "Workout videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'workout-videos');

CREATE POLICY "Users can upload their own workout videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workout-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own workout videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'workout-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own workout videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'workout-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Set up RLS policies for meal-photos bucket
CREATE POLICY "Meal photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'meal-photos');

CREATE POLICY "Users can upload their own meal photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own meal photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own meal photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Set up RLS policies for progress-photos bucket (private)
CREATE POLICY "Users can view their own progress photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own progress photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own progress photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own progress photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Success message
SELECT 'Storage buckets created successfully!' as message;