# Faucet Blockchain

1. Clonar el repositorio
2. Crear Wallet
```
docker run -v ./pwd.txt:/pwd.txt -v ./data:/data ethereum/client-go:v1.13.15 account new --datadir /data --password /pwd.txt       
```
3. Sustituir direcciones de Wallets del fichero genesis.json. Pueden ser Wallets ya existentes o creadas con el anterior comando. Se pueden añadir todas las que se desee. Se configura el balance deseado para cada Wallet.
```
"alloc": {
    "<DIRECCIÓN-WALLET-PRINCIPAL>": {
        "balance": "1000000000000000000000000000"
    },
    "<DIRECCIÓN-WALLET>": {
        "balance": "1000000000000000000000000000"
    }
}
```
3. Configurar Docker desde fichero Genesis
```
docker run -v ./genesis.json:/genesis.json -v ./data:/data ethereum/client-go:v1.13.15 init --datadir /data /genesis.json                    
```
4. Levantar Blockchain
```
docker run -d --rm \
  -v ./pwd.txt:/pwd.txt \
  -v ./data:/data \
  -p  5556:8545 \
  ethereum/client-go:v1.13.15 \
 --datadir /data \
 --unlock <DIRECCIÓN-WALLET-PRINCIPAL> \
 --allow-insecure-unlock \
 --mine \
 --miner.etherbase <DIRECCIÓN-WALLET-PRINCIPAL> \
 --password /pwd.txt \
 --http \
 --http.addr "0.0.0.0" \
 --http.api "admin,eth,debug,miner,net,txpool,personal,web3" \
 --http.corsdomain "*"
```
5. Importar cuentas creadas en Metamask desde el fichero UTC generado con el primer comando si fuese necesario.
6. Configurar Red (Blockchain) generada en Metamask con los siguientes valores:
    * **NOMBRE DE LA RED:** CUALQUIERA
    * **URL:** http://localhost:5556
    * **IDENTIFICADOR CADENA:** 15
    * **SIMBOLO DE LA MONEDA:** CUALQUIERA