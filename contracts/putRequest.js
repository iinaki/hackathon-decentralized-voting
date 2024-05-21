const consumerAddress = "0x8dFf78B7EE3128D00E90611FBeD20A71397064D9" // REPLACE this with your Functions consumer address
const subscriptionId = 3 // REPLACE this with your subscription ID

const sha_dni = args[0]

const url = 'https://dvote-api.onrender.com/users/' + sha_dni

console.log(url)

const response = await Functions.makeHttpRequest({
    url: url,
    method: "PUT"
});

console.log('api response data: ', JSON.stringify({response}))
if (response.error) {
    throw Error("Failed to get voter request");
}

const { data } = response;
console.log('api response data: ', JSON.stringify(data))
return Functions.encodeString(data);