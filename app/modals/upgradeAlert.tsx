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
}

export function UpgradeAlert({ isOpen, onClose, onConfirm }: UpgradeAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#1c1c1c] border-neutral-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-one">
            Limit Reached
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400 font-one">
            You've reached the link limit for your current plan. Upgrade your plan 
            to generate more links, access custom domains, and get advanced analytics.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800 hover:text-white border-none">
            Maybe Later
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-white text-black hover:bg-gray-200 font-bold"
          >
            View Plans
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}