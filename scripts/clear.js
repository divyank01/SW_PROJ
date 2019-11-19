const del = require('del')
del([`lib`,`build`]).then(paths => {
    console.log(`Deleting ${paths} \n`)
})