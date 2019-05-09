const {src, dest, series} = require('gulp')
const {resolve} = require('path')
const del = require('del')
const ts = require('gulp-typescript')

const RELEASE_PATH = 'dist'
const SOURCE_PATH = 'src'
const TS_CONFIG_FILE = 'tsconfig.json'

const RELEASE_TS_CONFIG = {
  sourceMap: true,
  declaration: true
}

async function clean(cb) {
  const target = resolve(RELEASE_PATH)
  try {
    await del(target)
    cb()
  } catch (e) {
    cb(e)
  }
}

function build() {
  return src(SOURCE_PATH + '/**/*.ts')
    .pipe(ts.createProject(TS_CONFIG_FILE, RELEASE_TS_CONFIG)())
    .pipe(dest(RELEASE_PATH))
}

const release = series(clean, build)

exports.default = release
exports.clean = clean
exports.build = build
exports.release = release
