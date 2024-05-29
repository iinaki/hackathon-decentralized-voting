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

return Functions.encodeUint256(dataGet.voto ? 1:0);
