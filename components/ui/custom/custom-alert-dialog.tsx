import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/ui/avatar';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type CustomAlertDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  onContinueClick: () => void;
  title: string;
  description: string;
  cancelButtonText: string;
  continueButtonText: string;
  dialogContentClassname?: string;
};

export default function CustomAlertDialog({
  open,
  onCloseDialog,
  onContinueClick,
  title,
  description,
  cancelButtonText,
  continueButtonText,
  dialogContentClassname,
}: CustomAlertDialogProps) {
  const DIALOG_CONTENT_CL = dialogContentClassname ?? 'max-w-xl p-16';
  function handleOnOpenChange() {
    onCloseDialog();
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOnOpenChange}>
      <AlertDialogContent className={DIALOG_CONTENT_CL}>
        <AlertDialogHeader>
          <Avatar className='bg-destructive-light mb-6 h-[60px] w-[60px] self-center text-center'>
            <TriangleAlert
              width={30}
              height={30}
              className='text-destructive mx-auto self-center'
            />
          </Avatar>
          <AlertDialogTitle className='text-red text-destructive-dark text-center text-[32px]'>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-grey-800 text-center text-base whitespace-pre-line'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='w-1/2 border border-neutral-200'>
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onContinueClick}
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'bg-destructive hover:bg-destructive-light w-1/2'
            )}
          >
            {continueButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
