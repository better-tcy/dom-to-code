import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import globby from 'globby'

export const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)
export const pathResolveUnix = (..._path: string[]) => pathResolve(..._path).replace(/\\/g, '/')

export const rootPath = pathResolve('../')
export const packagesGlobPaths = pathResolveUnix('../packages/*/')
export const packagesPaths = globby.sync(packagesGlobPaths, { onlyFiles: false, onlyDirectories: true })
export const rootLicense = pathResolve(rootPath, 'LICENSE')
export const rootReadmePaths = globby.sync(pathResolveUnix(rootPath, 'README*.md'), { onlyFiles: true })

export function copyFiles() {
  getPackagesInfo('public').map((pkgInfo) => {
    const packagePath = pkgInfo.path
    const pkgJson = pkgInfo.pkgJsonPath

    rootReadmePaths.map((rootReadmePath) => {
      const readmeFileName = path.basename(rootReadmePath)
      const pkgReadmePath = pathResolve(packagePath, readmeFileName)
      if (existsSync(pkgReadmePath))
        return

      copyFileSync(rootReadmePath, pkgReadmePath)
    })

    const license = pathResolve(packagePath, 'LICENSE')

    const pkg: Record<string, string> = JSON.parse(readFileSync(pkgJson, 'utf8')) || {}
    if (pkg.private)
      return
    if (!existsSync(license))
      copyFileSync(rootLicense, license)
  })
}

export interface PackageInfo { path: string; name: string; pkgJsonPath: string }
export function getPackagesInfo(type: 'public' | 'all'): PackageInfo[] {
  return packagesPaths.reduce<PackageInfo[]>((pkgInfos: PackageInfo[], packagePath) => {
    const pkgJson = pathResolve(packagePath, 'package.json')

    if (!existsSync(pkgJson))
      return pkgInfos

    const pkg: Record<string, string> = JSON.parse(readFileSync(pkgJson, 'utf8')) || {}

    if (type === 'public') {
      if (pkg.private)
        return pkgInfos
      return [
        ...pkgInfos,
        {
          path: packagePath,
          pkgJsonPath: pkgJson,
          name: pkg.name,
        },
      ]
    }
    else {
      return [
        ...pkgInfos,
        {
          path: packagePath,
          pkgJsonPath: pkgJson,
          name: pkg.name,
        },
      ]
    }
  }, [])
}

export function build() {
  const cmd = 'pnpm run build:all'
  console.log('start run command:', cmd)
  execSync(cmd, { stdio: 'inherit' })
}

export function generateChangelog() {
  const pkgInfos = getPackagesInfo('all')

  for (const pkgInfo of pkgInfos) {
    const cmd = `pnpm exec conventional-changelog -p angular -i '${path.resolve(
      pkgInfo.path,
      './CHANGELOG.md',
    )}' -s --commit-path . -l ${pkgInfo.name} -r 0`
    console.log('start run command:', cmd)
    execSync(cmd, { stdio: 'inherit' })
  }
}

export function release() {
  generateChangelog()
  execSync('git add .', { stdio: 'inherit' })
  execSync(
    'pnpm exec bumpp package.json packages/*/package.json --push --tag --all --commit "build: the v%s release"',
    {
      stdio: 'inherit',
    },
  )
}
