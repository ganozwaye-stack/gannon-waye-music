import type * as React from 'react';

declare module '@/components/ui/alert-dialog' {
  export const AlertDialog: React.ComponentType<any>;
  export const AlertDialogTrigger: React.ComponentType<any>;
  export const AlertDialogPortal: React.ComponentType<any>;
  export const AlertDialogOverlay: React.ComponentType<any>;
  export const AlertDialogContent: React.ComponentType<any>;
  export const AlertDialogHeader: React.ComponentType<any>;
  export const AlertDialogFooter: React.ComponentType<any>;
  export const AlertDialogTitle: React.ComponentType<any>;
  export const AlertDialogDescription: React.ComponentType<any>;
  export const AlertDialogAction: React.ComponentType<any>;
  export const AlertDialogCancel: React.ComponentType<any>;
}

declare module '@/components/ui/badge' {
  export const Badge: React.ComponentType<any>;
  export const badgeVariants: any;
}

declare module '@/components/ui/button' {
  export const Button: React.ComponentType<any>;
  export const buttonVariants: any;
}

declare module '@/components/ui/card' {
  export const Card: React.ComponentType<any>;
  export const CardHeader: React.ComponentType<any>;
  export const CardFooter: React.ComponentType<any>;
  export const CardTitle: React.ComponentType<any>;
  export const CardDescription: React.ComponentType<any>;
  export const CardContent: React.ComponentType<any>;
}

declare module '@/components/ui/dialog' {
  export const Dialog: React.ComponentType<any>;
  export const DialogTrigger: React.ComponentType<any>;
  export const DialogPortal: React.ComponentType<any>;
  export const DialogClose: React.ComponentType<any>;
  export const DialogOverlay: React.ComponentType<any>;
  export const DialogContent: React.ComponentType<any>;
  export const DialogHeader: React.ComponentType<any>;
  export const DialogFooter: React.ComponentType<any>;
  export const DialogTitle: React.ComponentType<any>;
  export const DialogDescription: React.ComponentType<any>;
}

declare module '@/components/ui/input' {
  export const Input: React.ComponentType<any>;
}

declare module '@/components/ui/label' {
  export const Label: React.ComponentType<any>;
}

declare module '@/components/ui/scroll-area' {
  export const ScrollArea: React.ComponentType<any>;
  export const ScrollBar: React.ComponentType<any>;
}

declare module '@/components/ui/select' {
  export const Select: React.ComponentType<any>;
  export const SelectGroup: React.ComponentType<any>;
  export const SelectValue: React.ComponentType<any>;
  export const SelectTrigger: React.ComponentType<any>;
  export const SelectContent: React.ComponentType<any>;
  export const SelectLabel: React.ComponentType<any>;
  export const SelectItem: React.ComponentType<any>;
  export const SelectSeparator: React.ComponentType<any>;
  export const SelectScrollUpButton: React.ComponentType<any>;
  export const SelectScrollDownButton: React.ComponentType<any>;
}

declare module '@/components/ui/separator' {
  export const Separator: React.ComponentType<any>;
}

declare module '@/components/ui/sheet' {
  export const Sheet: React.ComponentType<any>;
  export const SheetTrigger: React.ComponentType<any>;
  export const SheetClose: React.ComponentType<any>;
  export const SheetPortal: React.ComponentType<any>;
  export const SheetOverlay: React.ComponentType<any>;
  export const SheetContent: React.ComponentType<any>;
  export const SheetHeader: React.ComponentType<any>;
  export const SheetFooter: React.ComponentType<any>;
  export const SheetTitle: React.ComponentType<any>;
  export const SheetDescription: React.ComponentType<any>;
}

declare module '@/components/ui/skeleton' {
  export const Skeleton: React.ComponentType<any>;
}

declare module '@/components/ui/slider' {
  export const Slider: React.ComponentType<any>;
}

declare module '@/components/ui/switch' {
  export const Switch: React.ComponentType<any>;
}

declare module '@/components/ui/tabs' {
  export const Tabs: React.ComponentType<any>;
  export const TabsList: React.ComponentType<any>;
  export const TabsTrigger: React.ComponentType<any>;
  export const TabsContent: React.ComponentType<any>;
}

declare module '@/components/ui/textarea' {
  export const Textarea: React.ComponentType<any>;
}

declare module '@/components/ui/toast' {
  export const Toast: React.ComponentType<any>;
  export const ToastAction: React.ComponentType<any>;
  export const ToastClose: React.ComponentType<any>;
  export const ToastDescription: React.ComponentType<any>;
  export const ToastProvider: React.ComponentType<any>;
  export const ToastTitle: React.ComponentType<any>;
  export const ToastViewport: React.ComponentType<any>;
}

declare module '@/components/ui/toaster' {
  export const Toaster: React.ComponentType<any>;
}

declare module '@/components/ui/toggle' {
  export const Toggle: React.ComponentType<any>;
  export const toggleVariants: any;
}

declare module '@/components/ui/tooltip' {
  export const Tooltip: React.ComponentType<any>;
  export const TooltipTrigger: React.ComponentType<any>;
  export const TooltipContent: React.ComponentType<any>;
  export const TooltipProvider: React.ComponentType<any>;
}

declare module '@/components/ui/use-toast' {
  export const toast: any;
  export const useToast: any;
  export const reducer: any;
}

declare module '@/components/ui/VoiceButton' {
  const VoiceButton: React.ComponentType<any>;
  export default VoiceButton;
  export { VoiceButton };
}

declare module '@/components/ui/VoiceTextarea' {
  const VoiceTextarea: React.ComponentType<any>;
  export default VoiceTextarea;
  export { VoiceTextarea };
}
