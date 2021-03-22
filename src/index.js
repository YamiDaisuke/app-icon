const chalk = require('chalk');
const isImagemagickInstalled = require('../src/imagemagick/is-imagemagick-installed');
const generate = require('../src/generate');
// eslint-disable-next-line no-unused-vars
const labelImage = require('../src/label/label-image');
const fileExists = require('../src/utils/file-exists');

module.exports = ({ iconPath, searchPath, platforms }) => {
  return new Promise((resolve, reject) => {
    isImagemagickInstalled()
      .catch((err) => { throw err; })
      .then((imageMagickInstalled) => {
        if (!imageMagickInstalled) {
          console.error('  Error: ImageMagick must be installed. Try:');
          console.error('    brew install imagemagick');
          return reject(new Error('ImageMagick must be installed'));
        }

        //  Check that we have a source icon.
        return fileExists(iconPath);
      })
      .then((exists) => {
        if (!exists) {
          console.error(`Source file '${iconPath}' does not exist.`);
          return reject(new Error('Icon source file does not exist'));
        }
        //  Generate some icons.
        return generate({
          sourceIcon: iconPath,
          searchRoot: searchPath,
          platforms,
        });
      })
      .then(() => {
        resolve();
      })
      .catch((generateErr) => {
        console.error(chalk.red(`An error occurred generating the icons: ${generateErr.message}`));
        return reject(generateErr);
      });
  });
};
