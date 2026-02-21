import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { name, slug, description, image_url } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug, description: description ?? null, image_url: image_url ?? null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
