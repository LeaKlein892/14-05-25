import * as React from "react";
import { IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { lazy, Suspense } from "react";
const AccountMenuContent = lazy(() => import("./AccountMenuContent"));

export const AccountMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        size="large"
      >
        <AccountCircle />
      </IconButton>
      <Suspense fallback={null}>
        {open && (
          <AccountMenuContent anchorEl={anchorEl} handleClose={handleClose} />
        )}
      </Suspense>
    </div>
  );
};
