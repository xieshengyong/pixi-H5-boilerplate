// https://www.postcss.parts/?searchTerm=

// https://github.com/michael-ciniawsky/postcss-load-config
// https://github.com/postcss/autoprefixer
// https://github.com/cuth/postcss-pxtorem

module.exports = {
    'plugins': [
        require('autoprefixer'),
        require('postcss-pxtorem')({
            rootValue: 100,
            propWhiteList: []
        }),
    ]
};
