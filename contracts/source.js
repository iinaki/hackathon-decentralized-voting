const sha_dni = args[0];
const url = 'https://dvote-api.onrender.com/users/' + sha_dni;

console.log(url);

const responseGet = await Functions.makeHttpRequest({
    url: url,
    method: "GET"
});

console.log('GET API response data: ', JSON.stringify(responseGet));
if (responseGet.error) {
    throw Error("Failed to get voter request");
}

const dataGet = responseGet.data;
console.log('GET API response data: ', JSON.stringify(dataGet));

// Perform PUT request to update the voter data
const responsePut = await Functions.makeHttpRequest({
    url: url,
    method: "PUT"
});

console.log('PUT API response data: ', JSON.stringify(responsePut));
if (responsePut.error) {
    return Functions.encodeString("bsas");
}

const dataPut = responsePut.data;
console.log('PUT API response data: ', JSON.stringify(dataPut));
  
// Use JSON.stringify() to convert from JSON object to JSON string
// Finally, use the helper Functions.encodeString() to encode from string to bytes
return Functions.encodeString(JSON.stringify(dataPut.lugar_residencia));
