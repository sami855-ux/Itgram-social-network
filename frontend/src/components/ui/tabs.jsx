"use client"

export function Tabs({ children, defaultValue, className = "" }) {
  return <div className={`w-full ${className}`}>{children}</div>
}

export function TabsList({ children, className = "" }) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 ${className}`}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  children,
  value,
  isActive = false,
  onClick,
  className = "",
}) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900"
      } ${className}`}
      onClick={() => onClick && onClick(value)}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, activeValue, className = "" }) {
  if (value !== activeValue) return null
  return <div className={`mt-6 ${className}`}>{children}</div>
}
