var gulp         = require('gulp'),
    browserify   = require('browserify'),
    clean        = require('gulp-clean'),
    aliasify     = require('aliasify'),
    domain       = require('domain'),
    source       = require('vinyl-source-stream'), //convert browserify to use pipe
    tap          = require('gulp-tap'),
    streamify    = require('gulp-streamify'),
    concat       = require('gulp-concat'),
    gutil        = require('gulp-util'),

    argv         = require('yargs').argv,
    gulpif       = require('gulp-if'),
    uglify       = require('gulp-uglify');

//for testing only
var es6ify       = require('es6ify'),
    hbsfy        = require('hbsfy');

es6ify.traceurOverrides = {experimental: true};

// Browserify, transform and concat all javascript
gulp.task('scripts', function() {
	gulp.src('./src/js/de/_3m5/Coco.Init.js', {read:false})
        .pipe(tap(function(file) {
            var d = domain.create();

            d.on("error", function(err) {
                gutil.log(
                    gutil.colors.red("Browserify compile error:"), err.message, "\n\t", gutil.colors.cyan("in file"), file.path
                );
            });

            d.run(function() {
                file.contents = browserify({entries: [file.path]})
                    //.transform(aliasify)
                    .bundle();
            });
        }))
        .pipe(streamify(concat('Coco.js')))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('./build/js'))
});

gulp.task("concat", function() {
    return gulp.src(["src/js/core/dejavu/dejavu.js", "./build/js/Coco.js"])
        .pipe(concat("Coco.js"))
        .pipe(gulp.dest("./build/js"));
});


// Browserify, transform and concat all javascript
gulp.task('test', function() {
    gulp.src('./src/js/de/_3m5/config.js', {read:false})
        .pipe(tap(function(file) {
            var d = domain.create();

            d.on("error", function(err) {
                gutil.log(
                    gutil.colors.red("Browserify compile error:"), err.message, "\n\t", gutil.colors.cyan("in file"), file.path
                );
            });

            d.run(function() {
                file.contents = browserify({entries: [file.path]})
                    .add(es6ify.runtime)
                    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
                    .transform(hbsfy)
                    .transform(aliasify)
                    .bundle();
            });
        }))
        .pipe(streamify(concat('test.js')))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest('./build/js'))
});

// clean up target folder
gulp.task('clean', function() {
    return gulp.src(["build/*"], {read: false})
        .pipe(clean());
});

// copy local index file to build folder
gulp.task('html', function() {
    return gulp.src('html/**')
        .pipe(gulp.dest('./build'))
        .pipe(gulpif(argv.dev, livereload()));
});

// copy local js sources to build folder
gulp.task('vendor', function() {
    return gulp.src([
        'scripts/vendor/*.*'
    ])
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js/vendor'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('src/js/**', ['test']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch']);