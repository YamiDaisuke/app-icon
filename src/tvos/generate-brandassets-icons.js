const path = require('path');
const fs = require('fs-extra');
const resizeImage = require('../resize/resize-image');

const templateDir = path.join(__dirname, 'AppIcon.brandassets.template');

function generatebrandAssetsIcons(sourceIcon, brandAssets, results) {
  return new Promise((resolve, reject) => {
    //  We've got the brandAssets folder. Get the contents Json.
    const contentsPath = path.join(brandAssets, 'Contents.json');
    const contents = JSON.parse(fs.readFileSync(contentsPath, 'utf8'));
    const templateImages = contents.images;
    const multiScales = templateImages.length > 1;
    contents.images = [];


    //  Generate each image in the full icon set, updating the contents.
    return Promise.all(templateImages.map((image) => {
      const targetName = `${image.idiom}-${image.size}-${image.scale}.png`;
      const targetPath = path.join(brandAssets, targetName);
      const targetScale = parseInt(image.scale.slice(0, 1), 10);
      const targetSize = image.size.split('x').map(p => p * targetScale).join('x');
      return resizeImage(sourceIcon, targetPath, targetSize)
        .then(() => {
          results.icons.push(targetName);
          if (multiScales) {
            contents.images.push({
              size: image.size,
              idiom: image.idiom,
              scale: image.scale,
              filename: targetName,
            });
          } else {
            contents.images.push({
              size: image.size,
              idiom: image.idiom,
              filename: targetName,
            });
          }
        });
    }))
      .then(() => {
        fs.writeFile(contentsPath, JSON.stringify(contents, null, 2), (err) => {
          if (err) return reject(err);
          return resolve(results);
        });
      });
  });
}

//  Generate xCode icons given an brandAssets folder.
module.exports = (sourceIcon, brandAssets) => new Promise((resolve, reject) => {
  // export template

  const output = {
    icons: [],
    contentsPath: null,
  };
  const appIconFolders = [
    'App Icon.imagestack/Back.imagestacklayer/Content.imageset',
    'App Icon.imagestack/Front.imagestacklayer/Content.imageset',
    'App Icon.imagestack/Middle.imagestacklayer/Content.imageset',
    'App Icon - App Store.imagestack/Back.imagestacklayer/Content.imageset',
    'App Icon - App Store.imagestack/Front.imagestacklayer/Content.imageset',
    'App Icon - App Store.imagestack/Middle.imagestacklayer/Content.imageset',
  ];

  if (!sourceIcon.topShelfImage) { reject(Error('missing topShelfImage')); }

  if (!sourceIcon.topShelfWideImage) { reject(Error('missing topShelfWideImage')); }

  // eslint-disable-next-line max-len
  const generateAssets = (image, folder) => generatebrandAssetsIcons(image, path.join(brandAssets, folder), output);

  return fs.remove(brandAssets, { recursive: true })
    .then(() => fs.mkdir(brandAssets))
    .then(() => fs.copy(templateDir, brandAssets))
    .then(() => Promise.all(appIconFolders.map(folder => generateAssets(sourceIcon.icon, folder))))
    .then(() => generateAssets(sourceIcon.topShelfImage, 'Top Shelf Image.imageset'))
    .then(() => generateAssets(sourceIcon.topShelfWideImage, 'Top Shelf Image Wide.imageset'))
    .then(() => resolve(output))
    .catch(reject);
});
