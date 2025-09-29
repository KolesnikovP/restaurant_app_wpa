export const ROUTES = {
  root: "/",
  menuItems: "/menu-items",
  recipes: "/recipes",
  guidelines: "/guidelines",
  createMenuItem: "/create-menu-item",
} as const;

export type RouteKey = keyof typeof ROUTES;
