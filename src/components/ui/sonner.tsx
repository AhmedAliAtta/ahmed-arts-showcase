// import { useTheme } from "next-themes"; // تم حذف هذا السطر
import { Toaster as Sonner, toast } from "sonner"; // أبقينا على export لـ toast

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "system" } = useTheme(); // تم حذف هذا السطر

  return (
    <Sonner
      // theme={theme as ToasterProps["theme"]} // تم حذف هذا السطر
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

// أبقينا على export لـ toast احتياطاً لو كان مستخدماً في مكان آخر
export { Toaster, toast };
