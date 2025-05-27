import { ImageResponse } from 'next/og'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'yellow',
          fontWeight: 'bold',
        }}
      >
        T
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  )
}