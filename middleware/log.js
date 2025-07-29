import fs from 'fs';

export function logReqRes(fileName) {
  console.log("I am middleware");
  return (req, res, next) => {
    const logData = `Request Method: ${req.method}, URL: ${req.url}, IP: ${req.ip}, Time: ${new Date().toISOString()}\n`;
    fs.appendFile(fileName, logData, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
      next(); // Ensure next() is called even if there is an error
    });
  };
}

