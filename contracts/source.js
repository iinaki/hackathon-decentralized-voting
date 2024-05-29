const sha_dni = args[0];
const url = 'https://dvote-api.onrender.com/users/' + sha_dni;

const responseGet = await Functions.makeHttpRequest({
    url: url,
    method: "GET"
});

if (responseGet.error) {
    throw Error("Failed to get voter request");
}

const dataGet = responseGet.data;

// Perform PUT request to update the voter data
const responsePut = await Functions.makeHttpRequest({
    url: url,
    method: "PUT"
});

if (responsePut.error) {
    throw Error("Failed to update voter request");
}

const dataPut = responsePut.data;

return Functions.encodeString(JSON.stringify(dataGet.voto.toString()));