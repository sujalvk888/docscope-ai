import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-[#DB6E4C]/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#DB6E4C] text-[#F5F2E8] hover:bg-[#C25A3A] shadow-md shadow-[#5F170D]/10",
        outline: "border-[#D3C9AA] bg-transparent hover:bg-[#DFD6B7] hover:text-[#2B1C18]",
        secondary: "bg-[#1A1515] text-[#F5F2E8] hover:bg-[#2B2323] shadow-md shadow-[#1A1515]/20",
        ghost: "hover:bg-[#DFD6B7] hover:text-[#2B1C18]",
        destructive: "bg-[#5F170D] text-[#F5F2E8] hover:bg-[#7A2114]",
        link: "text-[#DB6E4C] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
export { Button, buttonVariants }