module.exports = function (grunt) {
  grunt.initConfig({
    'blueprint-validator': {
      'contract-test': {
        mdFiles: 'test/example/**/*.md',
        failOnWarnings: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-blueprint-validator')

  grunt.task.registerTask('test', ['blueprint-validator'])
  grunt.task.registerTask('default', ['test'])
}
