const find = require('../utils/find');

//  Given a search root, finds all tvos brandassets.
module.exports = (searchRoot) => {
  return find(searchRoot, (file, stat) => {
    //  exclude node modules from the search.
    if (file.match(/node_modules/)) return false;

    //  only grab the Brandassets folders.
    return file.split('/').pop().match(/.brandassets/) && stat.isDirectory();
  });
};
