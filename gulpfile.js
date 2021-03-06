/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/
var dist = {
  "root": "./dist/",
  "templates": "./dist/templates/",
  "js": "./dist/js",
  "images": "./dist/images",
  "fonts": "./dist/fonts",
  "css": "./dist/css",
  "flags": "./dist/flags",
};

var templates = [
  "02-organisms-00-global/*.*",
  "02-organisms-00-global-footer/*.*",
  "02-organisms-00-global-header/*.*",
  "02-organisms-00-global-empty-header/*.*",
  "02-organisms-00-global-mobile-header/*.*",
  "02-organisms-00-global-black-header/*.*",
  "02-organisms-00-global-white-header/*.*",
  "02-organisms-00-global-cookie-banner/*.*",
  "01-molecules-tech-spec/*.*",
  "01-molecules-tech-spec-zuhause-tech-spec-table/*.*",
  "01-molecules-tech-spec-copenhagen-tech-spec-table/*.*"
];

var localized_templates = [
  "de/",
  "en/"
];

var gulp = require('gulp'),
  Promise = require("bluebird");
gutil = require('gulp-util'),
  git = Promise.promisifyAll(require('gulp-git')),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  path = require('path'),
  browserSync = require('browser-sync').create(),
  argv = require('minimist')(process.argv.slice(2)),
  merge = require('merge-stream');

function resolvePath(pathInput) {
  return path.resolve(pathInput).replace(/\\/g, "/");
}

// SASS compilation
gulp.task('pl-sass', function () {
  return gulp.src(path.resolve(paths().source.css, '**/*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.resolve(paths().source.css)));
});

/******************************************************
 * COPY TASKS - stream assets from source to destination
******************************************************/
// JS copy
gulp.task('pl-copy:js', function () {
  return gulp.src('**/*.js', { cwd: resolvePath(paths().source.js) })
    .pipe(gulp.dest(resolvePath(paths().public.js)));
});

// JS copy dist
gulp.task('dist-copy:js', function () {
  return gulp.src('**/*.js', { cwd: resolvePath(paths().public.js) })
    .pipe(gulp.dest(resolvePath(dist.js)));
});

// Images copy
gulp.task('pl-copy:img', function () {
  return gulp.src('**/*.*', { cwd: resolvePath(paths().source.images) })
    .pipe(gulp.dest(resolvePath(paths().public.images)));
});

// Images copy dist
gulp.task('dist-copy:img', function () {
  return gulp.src('**/*.*', { cwd: resolvePath(paths().public.images) })
    .pipe(gulp.dest(resolvePath(dist.images)));
});

// Flags copy
gulp.task('pl-copy:flags', function () {
  console.log(resolvePath(paths().source.flags));
  console.log(resolvePath(paths().public.flags));
  return gulp.src('**/*.*', { cwd: resolvePath(paths().source.flags) })
    .pipe(gulp.dest(resolvePath(paths().public.flags)));
});

// Flags copy dist
gulp.task('dist-copy:flags', function () {
  return gulp.src('**/*.*', { cwd: resolvePath(paths().public.flags) })
    .pipe(gulp.dest(resolvePath(dist.flags)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function () {
  return gulp.src('favicon.ico', { cwd: resolvePath(paths().source.root) })
    .pipe(gulp.dest(resolvePath(paths().public.root)));
});

// Favicon copy dist
gulp.task('dist-copy:favicon', function () {
  return gulp.src('favicon.ico', { cwd: resolvePath(paths().public.root) })
    .pipe(gulp.dest(resolvePath(dist.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function () {
  return gulp.src('**/*.*', { cwd: resolvePath(paths().source.fonts) })
    .pipe(gulp.dest(resolvePath(paths().public.fonts)));
});

// Fonts copy dist
gulp.task('dist-copy:font', function () {
  return gulp.src('**/*.*', { cwd: resolvePath(paths().public.fonts) })
    .pipe(gulp.dest(resolvePath(dist.fonts)));
});

// CSS Copy
gulp.task('pl-copy:css', function () {
  return gulp.src(resolvePath(paths().source.css) + '/*.css')
    .pipe(gulp.dest(resolvePath(paths().public.css)))
    .pipe(browserSync.stream());
});

// CSS Copy dist
gulp.task('dist-copy:css', function () {
  return gulp.src(resolvePath(paths().public.css) + '/*.css')
    .pipe(gulp.dest(resolvePath(dist.css)));
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function () {
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/!(*.css)')
    .pipe(gulp.dest(resolvePath(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function () {
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/*.css')
    .pipe(gulp.dest(function (file) {
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return resolvePath(path.join(paths().public.styleguide, '/css'));
    }))
    .pipe(browserSync.stream());
});

// Templates copy to dist from public
gulp.task('dist-copy:templates', function () {
  return gulp.src(templates, { cwd: resolvePath(paths().public.patterns) })
    .pipe(gulp.dest(resolvePath(dist.templates)));
});

// Templates copy localized files to dist from public
gulp.task('dist-copy:localized-templates', function () {
  var folders = [];

  localized_templates.forEach(function (locale) {
    folders.push(
      gulp.src(templates, { cwd: resolvePath(paths().public.patterns + locale) })
        .pipe(gulp.dest(resolvePath(dist.templates + locale)))
    );
  });

  return merge(folders);
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
******************************************************/
//read all paths from our namespaced config file
var config = require('./patternlab-config.json'),
  patternlab = require('patternlab-node')(config);

function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  patternlab.build(done, getConfiguredCleanOption());
}

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    'pl-copy:js',
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    gulp.series('pl-sass', 'pl-copy:css', function (done) { done(); }),
    'pl-copy:styleguide',
    'pl-copy:styleguide-css',
    'pl-copy:flags'
  ),
  function (done) {
    done();
  })
);

gulp.task('dist-assets',
  gulp.parallel(
    'dist-copy:js',
    'dist-copy:img',
    'dist-copy:css',
    'dist-copy:favicon',
    'dist-copy:font',
    'dist-copy:flags'
  )
);

gulp.task('patternlab:version', function (done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function (done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task('patternlab:build', gulp.series('pl-assets', build, function (done) {
  done();
}));

gulp.task('patternlab:installplugin', function (done) {
  patternlab.installplugin(argv.plugin);
  done();
});

gulp.task('dist', gulp.series('patternlab:build', 'dist-assets', 'dist-copy:templates', 'dist-copy:localized-templates', function (done) {
  done();
}));
/******************************************************
 * SERVER AND WATCH TASKS
******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return resolvePath(paths().source.patterns) + '/**/*' + dotExtension;
  });
}

function reload() {
  browserSync.reload();
}

function reloadCSS() {
  browserSync.reload('*.css');
}

function watch() {
  gulp.watch(resolvePath(paths().source.css) + '/**/*.css', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:css', reloadCSS));
  gulp.watch(resolvePath(paths().source.styleguide) + '/**/*.*', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS));




  gulp.watch(path.resolve(paths().source.css, '**/*.scss')).on('change', gulp.series('pl-sass'));

  var patternWatches = [
    resolvePath(paths().source.patterns) + '/**/*.json',
    resolvePath(paths().source.patterns) + '/**/*.md',
    resolvePath(paths().source.data) + '/*.json',
    resolvePath(paths().source.fonts) + '/*',
    resolvePath(paths().source.js) + '/*',
    resolvePath(paths().source.images) + '/*',
    resolvePath(paths().source.meta) + '/*',
    resolvePath(paths().source.annotations) + '/*'
  ].concat(getTemplateWatches());

  console.log(patternWatches);

  gulp.watch(patternWatches, { awaitWriteFinish: true }).on('change', gulp.series(build, 'pl-copy:js', reload));
}

gulp.task('patternlab:connect', gulp.series(function (done) {
  browserSync.init({
    server: {
      baseDir: resolvePath(paths().public.root)
    },
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    },
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center'
      ]
    }
  }, function () {
    console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
    done();
  });
}));

/******************************************************
 * COMPOUND TASKS
******************************************************/
gulp.task('default', gulp.series('patternlab:build'));
gulp.task('patternlab:watch', gulp.series('patternlab:build', watch));
gulp.task('patternlab:serve', gulp.series('patternlab:build', 'patternlab:connect', watch));

/******************************************************
 * CUSTOM TASKS - tasks unique to this repo
******************************************************/

// Linting
gulp.task('scsslint', function () {
  return gulp.src('source/css/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Compound tasks
gulp.task('lint', gulp.parallel('scsslint'));
gulp.task('commitdist', gulp.series('dist', function (done) {
  var version = require('./package.json').version;
  var tag;
  var branch;

  git.revParseAsync({ args: '--abbrev-ref HEAD' })
    .then(function (parsedBranch) {
      if (parsedBranch === 'HEAD') {
        // We're on Travis and need to check it.
        branch = process.env.PULL_REQUEST !== 'false' ?
          process.env.TRAVIS_BRANCH :
          process.env.TRAVIS_PULL_REQUEST_BRANCH;
      } else {
        branch = parsedBranch;
      }
      if (branch === 'master') {
        tag = new Date().toISOString().replace(/:/g, '.') + '-' + version;
      } else if (branch === 'release') {
        tag = version;
      } else {
        tag = branch + '-' + new Date().toISOString().replace(/:/g, '.') + '-' + version;
      }
    }).then(function () {
      return git.checkoutAsync(tag, { args: '-b' })
    }).then(function () {
      gutil.log('Force adding dist to git');
      var stream = gulp.src('dist/')
        .pipe(git.add({ args: '-f' }))
        .pipe(git.commit('Distribution for ' + version));
      stream.on('end', function () {
        gutil.log('Tagging');
        git.tagAsync(tag, '')
          .then(function () {
            gutil.log('Checking out original branch');
            return git.checkoutAsync(branch);
          }).then(function () {
            gutil.log('Pushing tag to remote');
            return git.pushAsync('origin', [], { args: " --tags" });
          }).error(function (err) {
            throw err;
            gutil.log('Added and commited');
          }).done(function () {
            done()
          })
      });
    }).error(function (err) {
      throw err;
    });
}));
