const consumerAddress = "0x8dFf78B7EE3128D00E90611FBeD20A71397064D9" // REPLACE this with your Functions consumer address
const subscriptionId = 3 // REPLACE this with your subscription ID

const sha_dni = args[0]

const url = 'https://dvote-api.onrender.com/users/' + sha_dni

console.log(url)

const response = await Functions.makeHttpRequest({
    url: url,
    method: "GET"
});

console.log('api response data: ', JSON.stringify({response}))
if (response.error) {
    throw Error("Failed to get voter request");
}

const { data } = response;
console.log('api response data: ', JSON.stringify(data))
return Functions.encodeString(data);

const consumerAddress = "0x8dFf78B7EE3128D00E90611FBeD20A71397064D9"; // REPLACE this with your Functions consumer address
const subscriptionId = 3; // REPLACE this with your subscription ID

const sha_dni = args[0];
const url = 'https://dvote-api.onrender.com/users/' + sha_dni;

console.log(url);

const response = await Functions.makeHttpRequest({
    url: url,
    method: "GET"
});

console.log('API response data: ', JSON.stringify({response}));
if (response.error) {
    throw Error("Failed to get voter request");
}

const { data } = response;
console.log('API response data: ', JSON.stringify(data));

// Extract the fields from the response
const voterId = data.id;
const voterShaDni = data.sha_dni;
const hasVoted = data.voto;
const lugarResidencia = data.lugar_residencia;

console.log(`Voter ID: ${voterId}`);
console.log(`SHA DNI: ${voterShaDni}`);
console.log(`Has Voted: ${hasVoted}`);
console.log(`Lugar Residencia: ${lugarResidencia}`);

// ABI encode the fields
const ethers = await import("npm:ethers@6.10.0");
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "string", "bool", "string"],
    [voterId, voterShaDni, hasVoted, lugarResidencia]
);

console.log('Encoded data: ', encoded);

// Return the encoded data as Uint8Array
return ethers.getBytes(encoded);
