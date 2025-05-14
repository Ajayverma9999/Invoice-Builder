// import {
//   settingsData,
//   bettingAlowedGame
// } from '../helper/common';

// import 'dotenv/config';
// const env = process.env;
// const schedule = require('node-schedule');
// let logger = require('./logger');
// let path = require('path'),
//   fs = require('fs');
// let exec = require('child_process').exec;

// const isProduction = process.env.NODE_ENV === 'production';

// // DB Config
// const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;


// function fromDir(startPath, filter) {

//   if (!fs.existsSync(startPath)) {
//     return;
//   }

//   var files = fs.readdirSync(startPath);

//   for (var i = 0; i < files.length; i++) {
//     var filename = path.join(startPath, files[i]);
//     var stat = fs.lstatSync(filename);
//     if (stat.isDirectory()) {
//       fromDir(filename, filter); //recurse
//     } else if (filename.endsWith(filter)) {

//       let extension = path.extname(filename);
//       let realFileNameOnly = path.basename(filename, extension);
//       let dirPath = path.dirname(filename)
//       let bsonCovertcmd = `bsondump ${filename} --outFile=${dirPath}/${realFileNameOnly}.json`;
//       exec(bsonCovertcmd, function (error, stdout, stderr) { });
//     };

//   };
// };

// if (env.STOP_SCHEDULE != 1) {


// schedule.scheduleJob('0 0 0 * * *', async () => {
//   try {
//     let newBackupPath = "public/backup"

//     let cuDate = new Date();
//     let newFolder = cuDate.getFullYear() + '-' + (cuDate.getMonth() + 1);

//     if (!fs.existsSync(path.join(newBackupPath, newFolder))) {
//       fs.mkdirSync(path.join(newBackupPath, newFolder));
//     }

//     newBackupPath = path.join(newBackupPath, newFolder)

//     var cmd = 'mongodump ' + ' --uri ' + dbConnection + ' -d ' + ' hardwarewebsite ' + ' -o ' + newBackupPath

//     await exec(cmd, function (error, stdout, stderr) {
//       fromDir(newBackupPath, '.bson');
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });


//   const oneHourJob = schedule.scheduleJob('0 */1 * * *', async () => {

//   });

//   let everyDayJob = schedule.scheduleJob('0 0 * * *', async () => {

//   });
// }