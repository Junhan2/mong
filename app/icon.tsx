export default function Icon() {
  return new Response(
    '<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="black"/><text x="16" y="20" text-anchor="middle" fill="yellow" font-size="20" font-weight="bold">T</text></svg>',
    {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  )
}