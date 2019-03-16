/*
 * Copyright (c) 2019 LEEDIUM.
 * This file is subject to the terms and conditions
 * defined in file 'LICENSE.txt', which is part of this
 * source code package.
 */

/**
 * @project occ-media-uploader
 * @file app.js
 * @company LEEDIUM
 * @createdBy leedium
 * @contact support@leedium.com
 * @dateCreated 2019-03-06
 * @description Main entry file for application
 */

const FileHound = require('filehound');
const AdmZip = require('adm-zip');
const program = require('commander');
const download = require('download');
const imagemin = require('imagemin');
const got = require('got');
const fs = require('fs-extra');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const zipFileName = "images.zip"
const resObj = require('./restObj');
const packageJSON = require('../package');
const extensionsArray = ['.jpg', '.png', '.gif', 'svg', '.tiff', '.tif'];
const uploadTypes = {
    productImage: "productImage",
    general: "general",
    collectionImage: "collectionImage"
};
const occTokenGenerator = require("./occ-token-generator");
const distFolder = 'dist';
const apiFilesEndpoint = '/ccadmin/v1/files';
const list = val => val.split(',');

Promise.each = function(arr, func) {
    // if arr is not an array reject the process
    if(!Array.isArray(arr)){return Promise.reject(new Error(`The first argument passed must be of type Array`))}

    // if arr is empty return a "completed promise"
    if(arr.length === 0){return Promise.resolve()}

    // Start the flow with a resolved Promise and return the "then" with function execution of the next Promise
    return arr.reduce(function(a,b){
        return a.then(()=> func(b));
    }, Promise.resolve())
}

/**
 * Starts the transfer to all environments listed
 * @param program
 * @returns {Promise<void>}
 */
const start = async (program) => {
    try {
        const filehound = FileHound.create();
        const zipFileName = 'images.zip';
        const zip = new AdmZip();
        const uploadType = program.uploadtype || uploadTypes.general;
        let images;
        let imgPath = program.imagepath;

        // get the list of files from the source server
        try {
            var {items} = await resObj.apiCall(
                program.servers[0],
                program.keys[0],
                'GET',
                `${apiFilesEndpoint}?folder=/${program.uploadtype}&fields=url`, {});
            // loop through and save all these files to the file system
            // Promise.all(items.map(({url}_=> {
            //     download(url, 'dist').then(data => {
            //         console.log(url)
            //         // console.log( new URL(url).pathname.split('/').pop());
            //         fs.writeFileSync(`${new URL(url).pathname.split('/').pop()}`, data);
            //     });
            // }));



            // Promise.all(items.map(filePath =>
            //     // console.log('==>',filePath.url);
            //     download(filePath.url, 'dist', {
            //         filename:new URL(filePath.url).pathname.split('/').pop()
            //     }).then(data => {})))
            //         // console.log(new URL(filePath.url).pathname.split('/').pop())
                   // const file = new URL(filePath.url).pathname.split('/').pop();
                   // console.log('d:',file);
                   //  fs.writeFileSync(file, data);

                //     .then(() => {
                //     // fs.writeFileSync(new URL(filePath.url).pathname.split('/').pop(), data);
                //     console.log('done');
                // });

                // download(filePath.url,'dist').pipe(fs.createWriteStream(`dist/${new URL(filePath.url).pathname.split('/').pop()}`))


            await downloadImages(items);
            console.log('images download complete');




        }catch(err){
            console.log(err);
        }

        // program.servers.map((item, i) => {
        //     // return resObj.apiCall(
        //     //     item,
        //     //     program.keys[i],
        //     //     'GET',
        //     //     apiFilesEndpoint, {
        //     //         filename: zipFileName,
        //     //         segments: 1,
        //     //         uploadtype: uploadType
        //     //     })
        //     console.log(item);
        // });

        // if (typeof program.optimize !== 'undefined') {
        //     console.log('optimizing images');
        //     imgPath = 'build';
        //     if (program.optimize < 1 && program.optimize > 0) {
        //         const files = await imagemin(['./images/**/*.{jpg,png}'], './build/images', {
        //             plugins: [
        //                 imageminMozjpeg({quality: program.optimize * 100}),
        //                 imageminPngquant({
        //                     quality: [program.optimize, program.optimize]
        //                 })
        //             ]
        //         });
        //         // console.log('optimization complete')
        //     } else {
        //         throw new Error("quality must be between 0 and 1")
        //     }
        // }

        // images = filehound
        //     .path(imgPath)
        //     .ext(extensionsArray)
        //     .findSync();

        // images.forEach(file => {
        //     console.log(file)
            // zip.addLocalFile(file);
        // });

        // zip.toBuffer(async (successBuffer) => {
        //         try {
        //             const buffer64 = Buffer.from(successBuffer).toString('base64')
        //             const tokens = await Promise.all(program.servers.map((item, i) => {
        //                 return resObj.apiCall(
        //                     item,
        //                     program.keys[i],
        //                     'PUT',
        //                     apiFilesEndpoint, {
        //                         filename: zipFileName,
        //                         segments: 1,
        //                         uploadtype: uploadType
        //                     })
        //             }));
        //             await Promise.all(program.servers.map((item, i) => {
        //                 // console.log(`Sending media to ${item}`);
        //                 return resObj.apiCall(
        //                     item,
        //                     program.keys[i],
        //                     'POST',
        //                     `${apiFilesEndpoint}/${tokens[i].token}`, {
        //                         file: buffer64,
        //                         filename: zipFileName,
        //                         index: 0
        //                     });
        //             }));
        //             console.log(`Transfer to ${program.servers.length} environments complete.`)
        //         } catch (err) {
        //             console.log(err.message);
        //         }
        //     },
        //     (err) => {
        //         console.log(err.message);
        //     });
    }catch (err) {
        console.log(`Error: ${err.message}`)
    }
};

/**
 * Downloads group of images from target folder
 * @param images
 * @returns {Promise<any>}
 */
const downloadImages = (images) =>
    new Promise((resolve) => {
        fs.ensureDir(distFolder);
        fs.emptyDir(distFolder).then(async () => {

            // download all the images from the source
            const token = await occTokenGenerator.generateToken(program.servers[0], program.keys[0]);
            let counter = 0;
            images.map(filePath =>{
                const file = new URL(filePath.url).pathname.split('/').pop();
                got.stream(filePath.url,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .pipe(fs.createWriteStream(`dist/${file}`))
                    .on('finish', () => {
                        counter += 1;
                        console.log(file);
                        if(counter === images.length){
                            resolve();
                        }
                    })
            });


        })
    });

// main entry function
exports.main = function (argv) {
    program
        .version(packageJSON.version)
        .description(
            `Tool to transfer images across mutiple OCC instances\n `
        )
        .usage(
            "omu -s [servers] -t [keys] -d [imagePath] -u [uploadtype]",
            ""
        )
        //
        .option(
            "-s, --servers <items>",
            "Comma delimited string with the server definitions ie: server FROM,server TO",
            list
        )
        .option(
            "-t, --keys <items>",
            "Occ Admin api key for server ie: [server key source],[server key target]",
            list
        )
        .option(
            "-d, --imagepath <imagepath>",
            "path to folder to generate the image zipfile"
        )
        .option(
            "-u, --uploadtype <uploadtype>",
            "Upload Type < general, collections, product >"
        )
        .option(
            "-v, --optimize <n>",
            "optimizes images before packaging, (0 - 1)",
            parseFloat
        )
        .parse(argv);

    //set defaults
    start(program);
};


