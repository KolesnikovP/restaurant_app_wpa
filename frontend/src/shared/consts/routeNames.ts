export const ROUTES = {
  root: "/",
  menuItems: "/menu-items",
  menuItemDetailed: "/menu-item-detailed",
  recipes: "/recipes",
  guidelines: "/guidelines",
  createMenuItem: "/create-menu-item",
} as const;

export type RouteKey = keyof typeof ROUTES;
