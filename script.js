var account;
var NFTs = [];

const AIA_token_address = "0x2B55aA8aA844F3af6579c7956985921a463c1188";
const API_key = "2K8T212ERJ1FSICACWXA1A41JP2QU7ZGC6";

var AIA_token_balance = "-";

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');

    const ethereumButton = document.querySelector('.enableMetaMaskButton');
    const showAccount = document.querySelector('.showAccount');

    ethereumButton.addEventListener('click', () => {
        getAccount();
    }, {once : true});

    async function getAccount() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        while (!account) {
            account = accounts[0];
        }
        showAccount.innerHTML = "<center><b style='color: white;'>Wallet Address</b></center>" + account;
        ethereumButton.style.display = "none";
        
        const options = {method: 'GET'};

        const response = await fetch('https://testnets-api.opensea.io/api/v1/assets?owner=' + account, options)
        .then(response => response.json())
        .catch(err => window.alert(err));

        const response2 = await fetch("https://api-rinkeby.etherscan.io/api?module=account&action=tokenbalance&contractaddress=" + AIA_token_address + "&address=" + account + "&tag=latest&apikey=" + API_key, options)
        .then(response2 => response2.json())
        .catch(err => window.alert(err));

        try {
            if (response["assets"].length > 0) {
                for (let i=0; i<response["assets"].length; i++) {
                    if (response["assets"][i]["collection"]["name"] == "METAIA") {
                        const name = response["assets"][i]["name"];
                        const avatar_url = response["assets"][i]["image_url"];
                        var NFT = [];
                        NFT.push(name);
                        NFT.push(avatar_url);
                        NFTs.push(NFT);
                        break;  // Assume each account only can own one sneaker NFT
                    }
                }
            }
        }
        catch (err) {
            window.alert(err);
        }

        try {
            if (response2["status"] == "1" && response2["message"] == "OK") {
                AIA_token_balance = response2["result"].slice(0,-18);
            }
        }
        catch (err) {
            window.alert(err);
        }
        
        
        if (NFTs.length > 0) {
            document.getElementById("NFT-name").innerHTML = NFTs[0][0];
            document.getElementById("avatar").src = NFTs[0][1];
            document.getElementById("token_balance").innerHTML = AIA_token_balance;
            document.querySelector(".px-3").style.display = "block";
        }

    }

}
else {
    console.log("Fail to receive message");
    document.getElementById("userWallet").innerHTML = "Please check if you have already installed MetaMask in your browser 💡";
}  