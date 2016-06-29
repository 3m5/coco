var gulp         = require('gulp'),
    shell        = require('gulp-shell'),
    browserify   = require('browserify'),
    babel        = require('gulp-babel'),
    clean        = require('gulp-clean'),
    domain       = require('domain'),
    tap          = require('gulp-tap'),
    streamify    = require('gulp-streamify'),
    concat       = require('gulp-concat'),
    server       = require('gulp-webserver'),
    runsSequence = require('run-sequence'),
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
gulp.task('vendor', [], function() {
    return gulp.src(['./src/js/core/**'])
        .pipe(gulp.dest('./build/js/vendor'))
        .pipe(gulp.dest('./lib/vendor'));
});

// copy local index file to build folder
gulp.task('html', function() {
    return gulp.src(['src/html/**'])
        .pipe(gulp.dest('./build'));
});

// clean up target folder
gulp.task('clean', function() {
    return gulp.src(["build/*", "lib/*"], {read: false})
        .pipe(clean());
});

// clean up target folder
gulp.task('clean-lib', function() {
    return gulp.src(["lib/*"], {read: false})
        .pipe(clean());
});

gulp.task('serve', function () {
    gulp.run('vendor');
    gulp.run('test');
    gulp.run('html');
    gulp.src(['./build', './build/js'])
        .pipe(server({
            port: 9090,
            open: true,
            livereload: true,
            directoryListing: false
        }));
    return gulp.watch(['src/**', 'test/**'], ['test', 'html', 'vendor']);
});

gulp.task('compile', function() {
    runsSequence(['clean-lib'], ['babel', 'vendor']);
});

gulp.task('babel', function() {
    return gulp.src('src/js/de/_3m5/**/*.js')
        .pipe(babel({
          presets: ['es2015', 'stage-2', 'stage-3'],
          plugins: ['es6-promise']
        }))
        .pipe(gulp.dest('lib/'));
});

gulp.task('deploy', function () {
  return gulp
    .src(__filename)
    .pipe(open({uri: "https://www.3m5.de/fileadmin/coco/"}));
});

gulp.task('writedoc', function() {
    return gulp.src(["build/doc/*"], {read: false})
        .pipe(shell([
            'echo documentate code via gulp-shell...',
            'ndoc -i src/js/de/_3m5 -o html build/doc -p .ndoc --rebuild-output'
        ]));
});

gulp.task('documentate', function () {
  runsSequence(['writedoc'], ['deploy']);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['serve']);
