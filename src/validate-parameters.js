module.exports = function validateParameters(parameters) {
  //  Validate or assign the source icon.
  const sourceIcon = {
    icon: parameters.sourceIcon || 'icon.png',
  };

  if (parameters.topShelfImage) { sourceIcon.topShelfImage = parameters.topShelfImage; }
  if (parameters.topShelfWideImage) { sourceIcon.topShelfWideImage = parameters.topShelfWideImage; }

  //  Validate or assign the search path.
  const searchRoot = parameters.searchPath || './';

  //  Validate or assign the platforms.
  const platformsString = parameters.platforms || 'android,ios,tvos';
  const platforms = platformsString.split(',');
  for (let i = 0; i < platforms.length; i += 1) {
    if (!/android|ios|tvos/.test(platforms[i])) {
      throw new Error(`${platforms[i]} is not a valid platform.`);
    }
  }

  return { sourceIcon, searchRoot, platforms };
};
