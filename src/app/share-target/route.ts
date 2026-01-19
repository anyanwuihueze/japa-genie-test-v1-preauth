import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const title = formData.get('title');
  const text = formData.get('text');
  const url = formData.get('url');
  const files = formData.getAll('documents');

  // TODO: Handle shared content
  // For now, redirect to upload page
  return NextResponse.redirect(new URL('/upload', request.url));
}
