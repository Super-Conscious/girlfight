export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } = process.env
  const dc = MAILCHIMP_API_KEY.split('-')[1]

  const response = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, status: 'subscribed' }),
    }
  )

  if (response.ok) {
    return res.status(200).json({ success: true })
  }

  const data = await response.json()
  if (data.title === 'Member Exists') {
    return res.status(200).json({ success: true })
  }

  return res.status(500).json({ error: 'Subscription failed' })
}
