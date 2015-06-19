var gulp         = require('gulp'),
    browserify   = require('browserify'),
    clean        = require('gulp-clean'),
    domain       = require('domain'),
    tap          = require('gulp-tap'),
    streamify    = require('gulp-streamify'),
    concat       = require('gulp-concat'),
    server       = require('gulp-webserver'),
    gutil        = require('gulp-util');


//for testing only
var es6ify       = require('es6ify'),
    hbsfy        = require('hbsfy');

es6ify.traceurOverrides = {experimental: true};

// Browserify, transform and concat all javascript
gulp.task('test', function() {
    gulp.src('test/cocoTestApp.js', {read:false})
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
                    .bundle();
            });
        }))
        .pipe(streamify(concat('application.js')))
        .pipe(gulp.dest('./build/js'))
});

// copy local index file to build folder
gulp.task('vendor', function() {
    return gulp.src(['./src/js/core/**'])
        .pipe(gulp.dest('./build/js/vendor'));
});

// copy local index file to build folder
gulp.task('html', function() {
    return gulp.src(['src/html/**'])
        .pipe(gulp.dest('./build'));
});

// clean up target folder
gulp.task('clean', function() {
    return gulp.src(["build/*"], {read: false})
        .pipe(clean());
});

gulp.task('serve', function () {
    gulp.run('test');
    gulp.src(['./build', './build/js'])
        .pipe(server({
            port: 9090,
            livereload: true,
            directoryListing: false
        }));
    return gulp.watch(['src/', 'test/**'], ['test', 'html', 'vendor']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['vendor', 'html', 'serve']);