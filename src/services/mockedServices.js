function getInvoiceNumber() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = parseInt(Math.random() * (1000 - 10) + 10);
      resolve(random);
    }, 2000);
  });
}

function generateCuf(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockedCuf = makeid(20);
      console.log("Make id", mockedCuf);
      resolve(mockedCuf);
    }, 3000);
  });
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { getInvoiceNumber, generateCuf };
