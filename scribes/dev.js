import { execa } from "execa"
import { mkdir, readFile, rm, writeFile } from "fs/promises"
import { resolve } from "path"

await rm(resolve("dist"), { force: true, recursive: true })
await mkdir(resolve("dist"))
await writeFile(resolve("dist/package.json"), await readFile(resolve("package.json"), "utf-8"), { encoding: "utf-8", flag: "wx" })
await execa("tsc", ["-p", "tsconfig.dev.json", "--watch"], {
  stderr: process.stderr,
  stdout: process.stdout
})
