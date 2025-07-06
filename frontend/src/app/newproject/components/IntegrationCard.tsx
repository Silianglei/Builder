import { ReactNode } from "react"

interface IntegrationCardProps {
  name: string
  description: string
  icon: ReactNode
  selected: boolean
  onClick: () => void
  badge?: string
  disabled?: boolean
  compact?: boolean
}

export default function IntegrationCard({
  name,
  description,
  icon,
  selected,
  onClick,
  badge,
  disabled = false,
  compact = false
}: IntegrationCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full text-left transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${compact ? 'p-4' : 'p-6'}
        rounded-lg border-2
        ${selected 
          ? 'border-blue-500/50 bg-blue-500/10' 
          : 'border-white/10 hover:border-white/20 bg-white/5'
        }
      `}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-400 rounded-full" />
      )}

      {/* Badge */}
      {badge && !selected && (
        <div className="absolute top-3 right-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
            {badge}
          </span>
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`
          flex-shrink-0 flex items-center justify-center
          ${compact ? 'w-10 h-10' : 'w-12 h-12'}
          rounded-lg
          ${selected ? 'bg-blue-500/20' : 'bg-white/10'}
          transition-colors duration-200
        `}>
          <div className={`${selected ? 'text-blue-400' : 'text-gray-400'}`}>
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${compact ? 'text-sm' : 'text-base'} ${selected ? 'text-white' : 'text-gray-200'}`}>
            {name}
          </h3>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-400 mt-0.5`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  )
}