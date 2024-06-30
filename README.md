# DVOTE

The voting process in general elections is fraught with several critical challenges that undermine the integrity, transparency, and efficiency of the electoral system. These challenges include election fraud, lack of transparency, limited accessibility, inefficiency, and concerns about security and privacy. To address these issues, DVote, a decentralized voting application, leverages blockchain technology to provide a secure, transparent, efficient, and accessible voting system. For voters, DVote is incredibly user-friendly. The process of casting a vote is straightforward and intuitive, ensuring that even those with limited technological skills can participate with ease. Voters simply need to access the application, verify their identity using their ID and cast their vote securely and anonymously. It works by hashing the voters ID before sending the transaction in the blockchain with the users election choices, so that the register that is displayed in the blockchain does not show any personal information abaout the voter.

One of the significant challenges of DVote is the necessity to store data on which voters had already voted. This was crucial to ensure that each voter could vote only once, preserving the integrity of the election.

To overcome this challenge, we created and deployed a database and a web service. When a voter wants to vote, the smart contract calls the API of the database. If the voter is valid, the vote is fulfilled, and the voter receives an NFT that confirms they have voted. This integration ensures a seamless and secure voting process.

The call to the API is made using Chainlink Functions, which connect the smart contract with the deployed database. This approach not only ensures the uniqueness of each vote but also provides an additional layer of security and verification.

### How to run the app
1. Edit the contracts address in 'src/config.json'
2. Run in the terminal:
```
npm install
```
```
npm start
```

![alt text](img/flow-votante.png)
