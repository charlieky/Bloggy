
import { forwardRef } from "react"

export const VisuallyHidden = forwardRef(({ children, ...props }, ref) => (
  <span
    ref={ref}
    style={{
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0
    }}
    {...props}
  >
    {children}
  </span>
))
