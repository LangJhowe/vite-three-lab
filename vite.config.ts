import path from 'path'
import { defineConfig } from 'vite'

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr)
}

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: pathResolve('./src') }
    ]
  }
})
