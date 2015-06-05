var registerTask = require('../../lib/register-task');
var getShipit = require('../../lib/get-shipit');
var path = require('path2/posix');
var moment = require('moment');
var chalk = require('chalk');

/**
 * Update task.
 * - Create and define release path.
 * - Remote copy project.
 */

module.exports = function (gruntOrShipit) {
  registerTask(gruntOrShipit, 'deploy:update', task);

  function task() {
    var shipit = getShipit(gruntOrShipit);

    return createReleasePath()
    .then(remoteCopy)
    .then(function () {
      shipit.emit('updated');
    });

    /**
     * Create and define release path.
     */

    function createReleasePath() {
      shipit.releaseDirname = moment.utc().format('YYYYMMDDHHmmss');
      shipit.releasesPath = path.join(shipit.config.deployTo, 'releases');
      shipit.releasePath = path.join(shipit.releasesPath, shipit.releaseDirname);

      shipit.log('Create release path "%s"', shipit.releasePath);
      return shipit.remote('mkdir -p ' + shipit.releasePath)
      .then(function () {
        shipit.log(chalk.green('Release path created.'));
      });
    }

    /**
     * Remote copy project.
     */

    function remoteCopy() {
      shipit.log('Clone project to remote servers.');
      return shipit.remote('git clone -b ' + shipit.config.branch + ' --depth=1 ' + shipit.config.repositoryUrl + ' ' + shipit.releasePath)
      .then(function (res) {
        shipit.log(chalk.green('Finished copy.'));
      });
    }
  }
};
