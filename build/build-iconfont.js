const gulp = require('gulp');
const path = require('path');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const upload = require('gulp-upload');
const template = require("gulp-template");

const config = require('../src/config');
const svgDir = path.join(__dirname, '../assets/svg');
const srcPath = path.join(__dirname, '../src');
const distPath = path.join(__dirname, '../dist');

const fontName = `${config.name}`;
const formats = ['ttf', 'woff', 'woff2', 'svg', 'eot'];

const serverUrl = 'http://receiver1.lagou.com/upload';

// icon列表
let icons = [] // [{name: '', unicode: ''}]

function buildIconfont() {
    return gulp.src([`${svgDir}/*.svg`])
        .pipe(iconfontCss({
            fontName,
            path: `${srcPath}/template.tpl`,
            targetPath: '../dist/index.css',
            // firstGlyph: 0xf000,
            fontPath: config.cdnPath, // cdn地址
            cssClass: config.cssClass,
            cacheBuster: `t=${new Date().getTime()}`
        }))
        .pipe(iconfont({
            fontName,
            formats,
            normalize: true,
            options: {
                fontHeight: 1000
            }
        }))
        .on('glyphs', (glyphs) => {
            icons = glyphs;
        })
        .pipe(gulp.dest(distPath));
}

// 上传CDN
function uploadFils() {
    return gulp.src(['dist/*'])
        .pipe(upload({
            server: serverUrl,
            callback: function (err, data, res) {
                if (err) {
                    console.log('error:' + err.toString());
                } else {
                    console.log(data.toString());
                }
            }
        }));
}

// 生成例子
function demo() {
    return gulp.src('../src/demo.html')
        .pipe(template({
            icons,
            ...config
        }))
        .pipe(gulp.dest(distPath));
}

exports.default = gulp.series(buildIconfont, demo);
