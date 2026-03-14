"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  snapPoints?: (number | string)[];
  dismissible?: boolean;
  children: React.ReactNode;
}

export function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  snapPoints,
  dismissible = true,
  children,
}: BottomSheetProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      dismissible={dismissible}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className="overflow-y-auto px-4">{children}</div>
        {footer && (
          <DrawerFooter>
            {footer}
            <DrawerClose asChild>
              <button
                type="button"
                className="w-full rounded-lg border border-border py-2.5 text-sm font-medium text-muted-foreground active:bg-accent"
              >
                Cancel
              </button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
