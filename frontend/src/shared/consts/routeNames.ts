export const ROUTES = {
  root: "/",
  menuItems: "/menu-items",
  createMenuItem: "/create-menu-item",
} as const;

export type RouteKey = keyof typeof ROUTES;
