let [mode] = process.argv.splice(2);
const examples = "./examples"

let options = {
    jsxFactory: 'h',
    jsxFragment: 'h.f',
    entryPoints: [`${examples}/index.jsx`],
    outdir: examples,
    format: "esm",
    bundle: true,
    sourcemap: true
}
const esbuild = require('esbuild')

if (mode == "prod") {
    esbuild.build({
        ...options,
        entryPoints: ["src/index.js"],
        outdir: "dist"
    })
} else {
    esbuild.build({
        ...options,
        watch: {
            onRebuild(error, result) {
                if (error) console.error('watch build failed:', error)
                else console.log('watch build succeeded:', result)
            },
        }
    })
}
