export const existsSync = (path: string) => {
  return $fetch('/api/path/file-exists', {query: {path}})
}