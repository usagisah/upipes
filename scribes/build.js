import { exec } from "child_process"
import { readFile, rm, writeFile } from "fs/promises"
import { resolve } from "path"

await rm(resolve("dist"), { force: true, recursive: true })
exec("npm run format", () => {
  exec("tsc -p tsconfig.build.json", async err => {
    if (err) throw err
    await writeFile(resolve("dist/package.json"), await readFile(resolve("package.json"), "utf-8"), "utf-8")
  })
})
