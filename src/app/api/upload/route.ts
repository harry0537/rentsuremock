import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/imageUpload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const url = await uploadImage(file);
    
    return NextResponse.json({
      success: true,
      url,
      message: 'Image upload simulated successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 