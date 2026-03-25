export type BottomNavItem = {
  key: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
};
