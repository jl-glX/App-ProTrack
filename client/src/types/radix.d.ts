import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
import "@radix-ui/react-progress";
import "@radix-ui/react-slider";
import "@radix-ui/react-switch";
import "@radix-ui/react-toggle";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-popover";

declare module "@radix-ui/react-dialog" {
  export interface DialogOverlayProps {
    className?: string;
  }
  export interface DialogContentProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface DialogTriggerProps {
    asChild?: boolean;
    children?: React.ReactNode;
  }
  export interface DialogCloseProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface DialogTitleProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface DialogDescriptionProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-select" {
  export interface SelectTriggerProps {
    className?: string;
    children?: React.ReactNode;
    id?: string;
  }
  export interface SelectContentProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SelectItemProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SelectLabelProps {
    className?: string;
  }
  export interface SelectSeparatorProps {
    className?: string;
  }
  export interface SelectScrollUpButtonProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SelectScrollDownButtonProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SelectIconProps {
    asChild?: boolean;
    children?: React.ReactNode;
  }
  export interface SelectViewportProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-label" {
  export interface LabelProps {
    className?: string;
    children?: React.ReactNode;
    htmlFor?: string;
  }
}

declare module "@radix-ui/react-checkbox" {
  export interface CheckboxIndicatorProps {
    className?: string;
    children?: React.ReactNode;
  }
}

declare module "@radix-ui/react-progress" {
  export interface ProgressProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface ProgressIndicatorProps {
    className?: string;
    style?: React.CSSProperties;
  }
}

declare module "@radix-ui/react-slider" {
  export interface SliderProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SliderTrackProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SliderRangeProps {
    className?: string;
  }
  export interface SliderThumbProps {
    className?: string;
  }
}

declare module "@radix-ui/react-switch" {
  export interface SwitchProps {
    className?: string;
    children?: React.ReactNode;
  }
  export interface SwitchThumbProps {
    className?: string;
  }
}

declare module "@radix-ui/react-toggle" {
  export interface ToggleProps {
    className?: string;
  }
}

declare module "@radix-ui/react-tooltip" {
  export interface TooltipContentProps {
    className?: string;
  }
}

declare module "@radix-ui/react-popover" {
  export interface PopoverContentProps {
    className?: string;
  }
}
