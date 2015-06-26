# shipit-git

[![Build Status](https://travis-ci.org/KrashStudio/shipit-git.svg)](https://travis-ci.org/KrashStudio/shipit-git)
[![Dependency Status](https://david-dm.org/KrashStudio/shipit-git.svg?theme=shields.io)](https://david-dm.org/KrashStudio/shipit-git)
[![devDependency Status](https://david-dm.org/KrashStudio/shipit-git/dev-status.svg?theme=shields.io)](https://david-dm.org/KrashStudio/shipit-git#info=devDependencies)

Set of deployment tasks for [Shipit](https://github.com/shipitjs/shipit) based on git and rsync commands.

**Features:**

- Deploy tag, branch or commit
- Add additional behaviour using hooks
- Build your project locally or remotely
- Easy rollback

## Install

```
npm install KrashStudio/shipit-git
```

## Usage

### Example `shipitfile.js`

```js
module.exports = function (shipit) {
  require('shipit-git')(shipit);

  shipit.initConfig({
    default: {
      branch: 'master',
      url: 'https://project.com',
      key: '$HOME/.ssh/id_rsa.pub',
      deployTo: '/path/to/deploy',
      repositoryUrl: 'git@github.com:user/repo.git',
      workspace: '/path/to/worksace',
      keepReleases: 5,
      shallowClone: false
    },
    staging: {
      servers: 'user@myserver.com'
    }
  });
};
```

To deploy on staging, you must use the following command :

```
shipit staging deploy
```

You can rollback to the previous releases with the command :

```
shipit staging rollback
```

## Options

### workspace

Type: `String`

Define the local working path of the project deployed.

### deployTo

Type: `String`

Define the remote path where the project will be deployed. A directory `releases` is automatically created. A symlink `current` is linked to the current release.

### repositoryUrl

Type: `String`

Git URL of the project repository.

### branch

Type: `String`

Tag, branch or commit to deploy.

### ignores

Type: `Array<String>`

An array of paths that match ignored files. These paths are used in the rsync command.

### keepReleases

Type: `String`

Number of release to keep on the remote server.

### shallowClone

Type: `Boolean`

Perform a shallow clone. Default: `false`.

## Variables

Several variables are attached during the deploy and the rollback process:

### shipit.config.*

All options describe in the config sections are avalaible in the `shipit.config` object.

### shipit.releaseDirname

Attached during `deploy:update` and `rollback:init` task.

The current release dirname of the project, the format used is "YYYYMMDDHHmmss" (moment format).

### shipit.releasesPath

Attached during `deploy:update` and `rollback:init` task.

The remote releases path.

### shipit.releasePath

Attached during `deploy:update` and `rollback:init` task.

The complete release path : `path.join(shipit.releasesPath, shipit.releaseDirname)`.

### shipit.currentPath

Attached during `deploy:publish` and `rollback:init` task.

The current symlink path : `path.join(shipit.config.deployTo, 'current')`.

## Workflow tasks

- deploy
  - deploy:init
    - Emit event "deploy".
  - deploy:update
    - Create and define release path.
    - Remote copy project.
    - Emit event "updated".
  - deploy:publish
    - Update symlink.
    - Emit event "published".
  - deploy:clean
    - Remove old releases.
    - Emit event "cleaned".
- rollback
  - rollback:init
    - Define release path.
    - Emit event "rollback".
  - deploy:publish
    - Update symlink.
    - Emit event "published".
  - deploy:clean
    - Remove old releases.
    - Emit event "cleaned".

## Dependencies

### Local

- git 2.0.0+
- OpenSSH 5+

### Remote

- GNU coreutils 5+

## Contributors

- [welcoMattic](https://github.com/welcoMattic)

## License

MIT
