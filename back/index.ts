import express from 'express';
import { Request, Response } from 'express';
import {ethers} from 'ethers';
import fs from 'fs/promises';
import cors from 'cors';

// carga las variables de entorno
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 3333;

app.get("/api/balanceEthers/:address", async (req: Request, res: Response) => {
    const { address } = req.params;
    const provider = new ethers.JsonRpcProvider(process.env.URL_NODO);
    const balance = await provider.getBalance(address);
    res.json(
        { address, balance: Number(balance) / 10 ** 18, fecha: new Date().toISOString() }
    );
})
app.get("/api/balance/:address", async (req: Request, res: Response) => {
    const { address } = req.params;
    const retorno = await fetch(process.env.URL_NODO as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [
                address,
                'latest'
            ],
            id: 1
        })
    })
    const data: any = await retorno.json();
    res.json(
        { address, balance: Number(data.result) / 10 ** 18, fecha: new Date().toISOString() }
    );

})

app.get("/api/faucet/:address/:amount", async (req: Request, res: Response) => {
    const { address, amount } = req.params;
    const provider = new ethers.JsonRpcProvider(process.env.URL_NODO);
    const ruta = process.env.KEYSTORE_FILE as string;
    const rutaData = await fs.readFile(ruta, "utf8");
    const wallet = await ethers.Wallet.fromEncryptedJson(rutaData, process.env.KEYSTORE_PWD as string);
    const walletConnected = wallet.connect(provider);
    const tx = await walletConnected.sendTransaction({
        to: address,
        value: ethers.parseEther(amount)
    });
    const tx1 =  await tx.wait();

    const balance = await provider.getBalance(address)
    console.log("balance", balance.toString());
    res.json({ tx1, address, amount, balance: Number(balance) / 10 ** 18, fecha: new Date().toISOString() });
})   
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});