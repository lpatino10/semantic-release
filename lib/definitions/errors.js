const url = require('url');
const {inspect} = require('util');
const {toLower, isString} = require('lodash');
const pkg = require('../../package.json');
const {RELEASE_TYPE} = require('./constants');

const homepage = url.format({...url.parse(pkg.homepage), hash: null});
const stringify = obj => (isString(obj) ? obj : inspect(obj, {breakLength: Infinity, depth: 2, maxArrayLength: 5}));
const linkify = file => `${homepage}/blob/caribou/${file}`;

module.exports = {
  ENOGITREPO: () => ({
    message: 'Not running from a git repository.',
    details: `The \`semantic-release\` command must be executed from a Git repository.

The current working directory is \`${process.cwd()}\`.

Please verify your CI configuration to make sure the \`semantic-release\` command is executed from the root of the cloned repository.`,
  }),
  ENOREPOURL: () => ({
    message: 'The `repositoryUrl` option is required.',
    details: `The [repositoryUrl option](${linkify(
      'docs/usage/configuration.md#repositoryurl'
    )}) cannot be determined from the semantic-release configuration, the \`package.json\` nor the [git origin url](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes).

Please make sure to add the \`repositoryUrl\` to the [semantic-release configuration] (${linkify(
      'docs/usage/configuration.md'
    )}).`,
  }),
  EGITNOPERMISSION: ({options}) => ({
    message: 'The push permission to the Git repository is required.',
    details: `**semantic-release** cannot push the version tag to the branch \`${
      options.branch
    }\` on remote Git repository with URL \`${options.repositoryUrl}\`.

Please refer to the [authentication configuration documentation](${linkify(
      'docs/usage/ci-configuration.md#authentication'
    )}) to configure the Git credentials on your CI environment and make sure the [repositoryUrl](${linkify(
      'docs/usage/configuration.md#repositoryurl'
    )}) is configured with a [valid Git URL](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols).`,
  }),
  EINVALIDTAGFORMAT: ({tagFormat}) => ({
    message: 'Invalid `tagFormat` option.',
    details: `The [tagFormat](${linkify(
      'docs/usage/configuration.md#tagformat'
    )}) must compile to a [valid Git reference](https://git-scm.com/docs/git-check-ref-format#_description).

Your configuration for the \`tagFormat\` option is \`${stringify(tagFormat)}\`.`,
  }),
  ETAGNOVERSION: ({tagFormat}) => ({
    message: 'Invalid `tagFormat` option.',
    details: `The [tagFormat](${linkify(
      'docs/usage/configuration.md#tagformat'
    )}) option must contain the variable \`version\` exactly once.

Your configuration for the \`tagFormat\` option is \`${stringify(tagFormat)}\`.`,
  }),
  EPLUGINCONF: ({type, multiple, required, pluginConf}) => ({
    message: `The \`${type}\` plugin configuration is invalid.`,
    details: `The [${type} plugin configuration](${linkify(`docs/usage/plugins.md#${toLower(type)}-plugin`)}) ${
      required ? 'is required and ' : ''
    }must be ${
      multiple ? 'a single or an array of plugins' : 'a single plugin'
    } definition. A plugin definition is either a string or an object with a \`path\` property.

    Your configuration for the \`${type}\` plugin is \`${stringify(pluginConf)}\`.`,
  }),
  EPLUGIN: ({pluginName, type}) => ({
    message: `A plugin configured in the step ${type} is not a valid semantic-release plugin.`,
    details: `A valid \`${type}\` **semantic-release** plugin must be a function or an object with a function in the property \`${type}\`.

The plugin \`${pluginName}\` doesn't have the property \`${type}\` and cannot be used for the \`${type}\` step.

Please refer to the \`${pluginName}\` and [semantic-release plugins configuration](${linkify(
      'docs/usage/plugins.md'
    )}) documentation for more details.`,
  }),
  EANALYZECOMMITSOUTPUT: ({result, pluginName}) => ({
    message: 'The `analyzeCommits` plugin returned an invalid value. It must return a valid semver release type.',
    details: `The \`analyzeCommits\` plugin must return a valid [semver](https://semver.org) release type. The valid values are: ${RELEASE_TYPE.map(
      type => `\`${type}\``
    ).join(', ')}.

The \`analyzeCommits\` function of the \`${pluginName}\` returned \`${stringify(result)}\` instead.

We recommend to report the issue to the \`${pluginName}\` authors, providing the following informations:
- The **semantic-release** version: \`${pkg.version}\`
- The **semantic-release** logs from your CI job
- The value returned by the plugin: \`${stringify(result)}\`
- A link to the **semantic-release** plugin developer guide: [${linkify('docs/developer-guide/plugin.md')}](${linkify(
      'docs/developer-guide/plugin.md'
    )})`,
  }),
  EGENERATENOTESOUTPUT: ({result, pluginName}) => ({
    message: 'The `generateNotes` plugin returned an invalid value. It must return a `String`.',
    details: `The \`generateNotes\` plugin must return a \`String\`.

The \`generateNotes\` function of the \`${pluginName}\` returned \`${stringify(result)}\` instead.

We recommend to report the issue to the \`${pluginName}\` authors, providing the following informations:
- The **semantic-release** version: \`${pkg.version}\`
- The **semantic-release** logs from your CI job
- The value returned by the plugin: \`${stringify(result)}\`
- A link to the **semantic-release** plugin developer guide: [${linkify('docs/developer-guide/plugin.md')}](${linkify(
      'docs/developer-guide/plugin.md'
    )})`,
  }),
  EPUBLISHOUTPUT: ({result, pluginName}) => ({
    message: 'A `publish` plugin returned an invalid value. It must return an `Object`.',
    details: `The \`publish\` plugins must return an \`Object\`.

The \`publish\` function of the \`${pluginName}\` returned \`${stringify(result)}\` instead.

We recommend to report the issue to the \`${pluginName}\` authors, providing the following informations:
- The **semantic-release** version: \`${pkg.version}\`
- The **semantic-release** logs from your CI job
- The value returned by the plugin: \`${stringify(result)}\`
- A link to the **semantic-release** plugin developer guide: [${linkify('docs/developer-guide/plugin.md')}](${linkify(
      'docs/developer-guide/plugin.md'
    )})`,
  }),
};
