export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in-up">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-primary" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-base font-semibold text-text mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  )
}
