interface TextInputProps {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onActionClick?: () => void
  disabled?: boolean
  className?: string
}

export function TextInput({
  value = '',
  placeholder = 'Test',
  onChange,
  onActionClick,
  disabled = false,
  className = '',
}: TextInputProps) {
  return (
    <div className={`text-input-container ${className}`}>
      <input
        type="text"
        className="text-input-field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
      <button
        type="button"
        className="text-input-action-button"
        onClick={onActionClick}
        disabled={disabled}
        aria-label="Action"
      >
        <svg
          className="text-input-action-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="10"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </button>
    </div>
  )
}
