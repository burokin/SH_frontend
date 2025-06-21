export function getRelativePath(pathname: string): string {
  return /^\//.test(pathname) ? pathname.slice(1) : pathname;
}
