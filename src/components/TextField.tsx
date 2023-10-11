import { cn } from '@/lib/utils'

interface ITextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  hasError?: boolean
  redText?: boolean
}

export function TextField({
  label,
  hasError,
  redText,
  ...props
}: ITextFieldProps) {
  const { className, readOnly, ...rest } = props

  return (
    <label className={`flex flex-col ${className}`}>
      <span className="mb-1 whitespace-nowrap text-sm font-semibold text-slate-300">
        {label}
      </span>
      <input
        type="text"
        className={cn(
          'w-full rounded p-2 text-base font-normal text-slate-800',
          readOnly ? 'bg-gray-300' : 'bg-white',
          hasError ? 'border border-red-400' : 'border-transparent',
          redText ? 'font-bold text-red-500' : '',
        )}
        {...rest}
        readOnly={readOnly}
      />
    </label>
  )
}
