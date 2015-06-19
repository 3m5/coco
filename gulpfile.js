var gulp         = require('gulp'),
    browserify   = require('browserify'),
    clean        = require('gulp-clean'),
    domain       = require('domain'),
    tap          = require('gulp-tap'),
    streamify    = require('gulp-streamify'),
    concat       = require('gulp-concat'),
    gutil        = require('gulp-util');


//for testing only
var es6ify       = require('es6ify'),
    hbsfy        = require('hbsfy');

es6ify.traceurOverrides = {experimental: true};

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
                    .bundle();
            });
        }))
        .pipe(streamify(concat('test.js')))
        .pipe(gulp.dest('./build/js'))
});

// clean up target folder
gulp.task('clean', function() {
    return gulp.src(["build/*"], {read: false})
        .pipe(clean());
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('src/js/**', ['test']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['test', 'watch']);