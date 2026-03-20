export default function WriteLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <div className="bg-card rounded-xs shadow-md border border-border/50 px-8 md:px-12 py-10 paper-texture animate-pulse">
        <div className="min-h-[calc(100vh-16rem)]" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-4 w-32 bg-muted rounded-xs" />
        <div className="h-8 w-24 bg-muted rounded-xs" />
      </div>
    </div>
  )
}
