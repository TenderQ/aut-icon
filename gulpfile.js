const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const upload = require('gulp-upload');
const clean = require('gulp-clean');
const template = require("gulp-template");

const config = require('./src/config');
const svgDir = path.join(__dirname, './assets/svg');
const srcPath = path.join(__dirname, './src');
const libPath = path.join(__dirname, './lib');
const distPath = path.join(__dirname, './dist');

const fontName = `${config.name}`;
const formats = ['ttf', 'woff', 'woff2', 'svg', 'eot'];

// icon列表
let icons = [] // [{name: '', unicode: ''}]

gulp.task('iconfont', function() {
    return gulp.src([`${svgDir}/*.svg`])
        .pipe(iconfontCss({
            fontName,
            path: `${srcPath}/template.tpl`,
            targetPath: './index.css',
            // firstGlyph: 0xf000,
            fontPath: config.fontPath,
            cssClass: config.cssClass,
            cacheBuster: `t=${new Date().getTime()}`
        }))
        .pipe(iconfont({
            fontName,
            formats,
            normalize: true,
            options: {
                descent: 0,
                fontHeight: 1024
            }
        }))
        .on('glyphs', (glyphs) => {
            icons = glyphs;
            glyphs.forEach(item => {
                item.unicode = item.unicode.map(u => u.charCodeAt(0).toString(16));
            })
            fs.writeFile(`${distPath}/manifest.json`, JSON.stringify(glyphs), err => {
                err && console.log(err);
            })
        })
        .pipe(gulp.dest(libPath));
});

// 生成例子
gulp.task('demo', () => {
    return gulp.src('src/demo.html')
        .pipe(template({
            icons,
            ...config
        }))
        .pipe(gulp.dest(distPath));
});

gulp.task('clean', () => {
    return gulp.src(['lib/*', 'dist/*'])
        .pipe(clean());
});

gulp.task('build', gulp.series('clean', 'iconfont', 'demo'));

// 上传至CDN（暂不支持）
const serverUrl = 'http://receiver1.lagou.com/upload';
gulp.task('upload', () => {
    return gulp.src(['lib/*'])
        .pipe(upload({
            server: serverUrl,
            callback: function (err, data, res) {
                if (err) {
                    console.log('error:' + err.toString());
                }
            }
        }));
});