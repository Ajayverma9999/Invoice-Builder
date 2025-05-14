import multer from 'multer'

const uploadDestination = (uploadedFolderName) => {
   try {
      return multer({
         storage: multer.diskStorage({
            destination: (req, file, cb) => {
               cb(null, `public/uploads/${uploadedFolderName}/`)
            },
            filename: (req, file, cb) => {
               let customFileName = Date.now() + '-' + Math.round(Math.random() * 1E9),
                  fileExtension = file.originalname.split('.')[1] // get file extension from original file name
               cb(null, customFileName + '.' + fileExtension)
            }
         })
      })
      
   } catch (error) {
      console.log(error);
   }

}




module.exports = { uploadDestination };