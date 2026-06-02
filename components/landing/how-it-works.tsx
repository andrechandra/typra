const steps = [
  {
    number: '01',
    heading: 'Start your day',
    body: 'Open the dashboard. See today\'s habits, pending tasks, and your current writing streak at a glance.',
  },
  {
    number: '02',
    heading: 'Build your routine',
    body: 'Check off habits, complete tasks, and write a journal entry. Everything lives in one calm workspace.',
  },
  {
    number: '03',
    heading: 'Reflect and share',
    body: 'Review your streak calendar, revisit past entries, and optionally share your writing to the community forum.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-border/40 px-4 py-16 md:py-20 animate-in fade-in duration-700 delay-200">
      <div className="max-w-2xl mx-auto space-y-0">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-jetbrains text-center mb-10">
          How it works
        </p>
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`relative flex gap-8 py-8 ${i < steps.length - 1 ? 'border-b border-border/40' : ''}`}
          >
            <span className="flex-shrink-0 font-jetbrains font-semibold text-5xl text-muted-foreground/10 leading-none select-none w-16 text-right">
              {step.number}
            </span>
            <div className="space-y-1.5 pt-1">
              <p className="font-jetbrains text-sm font-medium">{step.heading}</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-jetbrains max-w-sm">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
