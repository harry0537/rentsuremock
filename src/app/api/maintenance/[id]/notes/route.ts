import { NextResponse } from 'next/server';
import { MaintenanceNote } from '@/types/maintenance';

// Mock data for demonstration
const mockNotes: MaintenanceNote[] = [];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const notes = mockNotes.filter(note => note.requestId === params.id);
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noteData = await request.json();
    
    // TODO: Add validation and actual database storage
    const newNote: MaintenanceNote = {
      ...noteData,
      id: Math.random().toString(36).substr(2, 9),
      requestId: params.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockNotes.push(newNote);
    return NextResponse.json(newNote);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 