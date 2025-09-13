// Setup Supabase Storage Buckets
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvpzxwgvgnrvtvmvnych.supabase.co';
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY'; // You need to get this from Supabase dashboard

// IMPORTANT: Service role key has admin privileges - only use server-side
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorageBuckets() {
  console.log('🪣 Setting up Supabase Storage Buckets...\n');

  // Bucket configurations
  const buckets = [
    {
      name: 'avatars',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: 5242880, // 5MB
      policies: {
        'Allow public read': {
          definition: `bucket_id = 'avatars'`,
          operation: 'SELECT',
          role: 'public'
        },
        'Allow authenticated upload': {
          definition: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`,
          operation: 'INSERT',
          role: 'authenticated'
        },
        'Allow users to update own files': {
          definition: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'UPDATE',
          role: 'authenticated'
        },
        'Allow users to delete own files': {
          definition: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'DELETE',
          role: 'authenticated'
        }
      }
    },
    {
      name: 'workout-videos',
      public: true,
      allowedMimeTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
      maxFileSize: 104857600, // 100MB
      policies: {
        'Allow public read': {
          definition: `bucket_id = 'workout-videos'`,
          operation: 'SELECT',
          role: 'public'
        },
        'Allow authenticated upload': {
          definition: `bucket_id = 'workout-videos' AND auth.role() = 'authenticated'`,
          operation: 'INSERT',
          role: 'authenticated'
        },
        'Allow users to update own files': {
          definition: `bucket_id = 'workout-videos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'UPDATE',
          role: 'authenticated'
        },
        'Allow users to delete own files': {
          definition: `bucket_id = 'workout-videos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'DELETE',
          role: 'authenticated'
        }
      }
    },
    {
      name: 'meal-photos',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFileSize: 10485760, // 10MB
      policies: {
        'Allow public read': {
          definition: `bucket_id = 'meal-photos'`,
          operation: 'SELECT',
          role: 'public'
        },
        'Allow authenticated upload': {
          definition: `bucket_id = 'meal-photos' AND auth.role() = 'authenticated'`,
          operation: 'INSERT',
          role: 'authenticated'
        },
        'Allow users to update own files': {
          definition: `bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'UPDATE',
          role: 'authenticated'
        },
        'Allow users to delete own files': {
          definition: `bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'DELETE',
          role: 'authenticated'
        }
      }
    },
    {
      name: 'progress-photos',
      public: false, // Private - only user can see their own
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFileSize: 10485760, // 10MB
      policies: {
        'Allow users to read own files': {
          definition: `bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'SELECT',
          role: 'authenticated'
        },
        'Allow authenticated upload': {
          definition: `bucket_id = 'progress-photos' AND auth.role() = 'authenticated'`,
          operation: 'INSERT',
          role: 'authenticated'
        },
        'Allow users to update own files': {
          definition: `bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'UPDATE',
          role: 'authenticated'
        },
        'Allow users to delete own files': {
          definition: `bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]`,
          operation: 'DELETE',
          role: 'authenticated'
        }
      }
    }
  ];

  // Create buckets
  for (const bucket of buckets) {
    try {
      console.log(`📦 Creating bucket: ${bucket.name}`);
      
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowedMimeTypes: bucket.allowedMimeTypes,
        fileSizeLimit: bucket.maxFileSize
      });

      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Bucket '${bucket.name}' already exists - skipping`);
        } else {
          console.error(`❌ Failed to create bucket '${bucket.name}':`, error.message);
        }
      } else {
        console.log(`✅ Bucket '${bucket.name}' created successfully`);
      }
    } catch (error) {
      console.error(`❌ Error creating bucket '${bucket.name}':`, error);
    }
  }

  console.log('\n🎉 Storage bucket setup complete!');
  console.log('\n📋 Created Buckets:');
  console.log('  • avatars (public) - Profile pictures');
  console.log('  • workout-videos (public) - Workout demonstration videos');
  console.log('  • meal-photos (public) - Meal images');
  console.log('  • progress-photos (private) - User progress photos');
}

// Run setup
setupStorageBuckets().catch(console.error);