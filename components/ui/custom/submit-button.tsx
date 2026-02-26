import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  className?: string;
  text: string;
};

const SubmitButton = ({
  isLoading,
  text,
  className,
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      className={cn("min-w-[150px] hover:cursor-pointer", className)}
      type="submit"
      {...props}
    >
      {isLoading ? <LoaderIcon className="h-5 w-5 animate-spin" /> : text}
    </Button>
  );
};
export { SubmitButton };
