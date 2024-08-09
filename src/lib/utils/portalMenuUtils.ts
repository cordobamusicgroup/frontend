export const filterItemsByRole = <T extends { roles: string[] }>(items: T[], role: string): T[] => {
  return items.filter((item) => item.roles.includes("ALL") || item.roles.includes(role));
};
