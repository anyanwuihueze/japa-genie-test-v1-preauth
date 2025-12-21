export default function DebugMobilePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mobile Debug - Quick Check</h1>
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <h2 className="text-xl font-semibold mb-3">Viewport Status</h2>
        <p>Check Chrome DevTools Console for diagnostics.</p>
        <p>Press F12 → Console → Paste diagnostic code</p>
      </div>
    </div>
  )
}
