export interface DialogProps {
  open?: boolean;
  showCloseButton?: boolean;
  fullScreen?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  handleClose: () => void;
  scroll?: "body" | "paper";
}
