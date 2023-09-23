import { cn } from "@/lib/utils";

interface ITextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError?: boolean;
  redText?: boolean;
}

export function TextField({
  label,
  hasError,
  redText,
  ...props
}: ITextFieldProps) {
  const { className, readOnly, ...rest } = props;

  return (
    <label className={`flex flex-col ${className}`}>
      <span className="mb-1 text-sm font-semibold text-slate-300 whitespace-nowrap">
        {label}
      </span>
      <input
        type="text"
        className={cn(
          "w-full p-2 rounded font-normal text-slate-800 text-base",
          readOnly ? "bg-gray-300" : "bg-white",
          hasError ? "border border-red-400" : "border-transparent",
          redText ? "text-red-500 font-bold" : ""
        )}
        {...rest}
        readOnly={readOnly}
      />
    </label>
  );
}
