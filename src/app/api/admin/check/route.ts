import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const allowedIps = (process.env.ADMIN_IPS || '').split(',').map(ip => ip.trim());

  return NextResponse.json({
    isAdmin: allowedIps.includes(ip),
  });
} 