"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UpgradeAlertProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function UpgradeAlert({ isOpen, onClose, onConfirm, title, description }: UpgradeAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-background border-border text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-one">
            {title || "Limit Reached"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground font-one">
            {description || "You've reached the limit for your current plan. Upgrade your plan to get access to more features and higher limits."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground border-none">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            View Plans
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
