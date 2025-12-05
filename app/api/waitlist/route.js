import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if email already exists in Supabase
    const { data: existing } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { message: 'You are already on the waitlist!' },
        { status: 200 }
      )
    }

    // Insert into Supabase waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email.toLowerCase(),
          created_at: new Date().toISOString(),
        },
      ])

    if (insertError) {
      console.error('Waitlist insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      )
    }

    // Add to Brevo mailing list if API key and list ID are configured
    const brevoApiKey = process.env.BREVO_API_KEY
    const brevoListId = process.env.BREVO_LIST_ID

    if (brevoApiKey && brevoListId) {
      try {
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            listIds: [parseInt(brevoListId)],
            updateEnabled: false
          })
        })

        if (!brevoResponse.ok) {
          const brevoError = await brevoResponse.json()
          console.error('Brevo API error:', brevoError)
          // Don't fail the request if Brevo fails - user is already in Supabase
        }
      } catch (brevoError) {
        console.error('Brevo integration error:', brevoError)
        // Don't fail the request if Brevo fails - user is already in Supabase
      }
    }

    return NextResponse.json(
      { message: 'Successfully joined the waitlist!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
