import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value?: number
  onValueChange?: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 10, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange?.(newValue)
    }

    return (
      <div className="relative w-full">
        <input
          type="range"
          className={cn(
            "w-full",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        {value !== undefined && (
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{min}</span>
            <span className="font-medium">{value}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }

