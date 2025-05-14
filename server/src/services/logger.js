import Error from "../features/Error/index.js";

let logger = {};

logger.error = async (message, ...metaObject) => {

  if( Array.isArray( metaObject) ) {
    metaObject = metaObject[0].metadata;
   }
    
    await Error.create({
        message : message,
        meta: metaObject,
        level:'error'
    });
};


logger.info = async (message, metaObject = '') => {

    console.log(metaObject);

    await Error.create({
        message : message,
        meta: metaObject,
        level:'info'
    });
};
export default logger;