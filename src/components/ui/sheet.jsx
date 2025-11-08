import * as RadixUI from "@radix-ui/react-dialog";
import { cva} from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef,
  React.ComponentPropsWithoutRef
>(({ className, ...props }, ref) => (
  
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants,
        bottom,
        left,
        right,
      },
    },
    defaultVariants,
    },
  },
);

interface SheetContentProps
  WithoutRef,
    VariantProps {}

const SheetContent = React.forwardRef, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (

        {children}

          Close

  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes) => (
  
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes) => (
  
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef,
  React.ComponentPropsWithoutRef
>(({ className, ...props }, ref) => (
  
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef,
  React.ComponentPropsWithoutRef
>(({ className, ...props }, ref) => (
  
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,

