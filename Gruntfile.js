const { initGlobals } = require('./build/config/init');

module.exports = function (grunt) {
    initGlobals(grunt);

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        configPath: process.cwd() + '/build',
        loadGruntTasks: {
            pattern: 'grunt-*',
            scope  : 'devDependencies',
            config : require('./package.json'),
        },
        postProcess: function(config) {
            // release to translations automatically after releasing to staging, since staging release is always with 'cleanup'
            if (global.release_target === 'staging') {
                config.aliases.release.push('shell:release_translations');
            }
        },
    });

    // Определяем задачу copy, чтобы избежать ошибки "No 'copy' targets found"
    grunt.initConfig({
        copy: {
            main: {
                expand: true,
                cwd: 'src/',  // Исходная директория
                src: '**',    // Какие файлы копировать
                dest: 'dist/' // Директория назначения
            }
        },
        shell: {
            compile_dev: {
                command: 'node scripts/render.js -d' // Исправлено
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['copy', 'shell:compile_dev']);
};
