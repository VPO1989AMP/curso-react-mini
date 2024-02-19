import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useFormAction } from "react-router-dom";
import{useForm} from 'react-hook-form'
const {ethereum} = window



export function Balance() {
    const {register, handleSubmit} = useForm();
    const [cuenta, setCuenta] = useState(null);
    const [balance, setBalance] = useState(null);
    const [ok, setOk]= useState(null);
    const [ko, setKo]= useState(null);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then(cuentas => {
                setCuenta(cuentas[0]);
                window.ethereum.on('accountsChanged', (i) => {
                    setCuenta(i[0]);
                });
            }).catch(err => console.error(err));
        }
    }, []);

    useEffect(() => {
        if (cuenta) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            provider.getBalance(cuenta).then(bal => {
                console.log(ethers.formatEther(bal));
                setBalance(ethers.formatEther(bal));
            }).catch(err => console.error(err));
        }
    }, [cuenta]);

    async function submit(data){
        setKo(null)
        setOk(null)
        const parametros ={
            from:cuenta,
            to: data.address,
            value: ethers.parseEther(data.amount)
        }
        //console.log(parametros)
        try{
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [parametros]
            })
            setOk(txHash)
        } catch (error) {
            setKo("error en la transacción", error.message)

        }
    }

        if (!ethereum) {
            return <div>No hay MetaMask</div>;
        }

        return (
            <div>
                <p>Cuenta:{cuenta ? cuenta : 'Cargando...'}</p>
                <p>Saldo:{balance ? balance : 'Cargando balance...'}</p>
                <form className="form-inline" onSubmit={handleSubmit(submit)}>
                    <div className="form-group mb-3">
                        <label htmlFor="address">Address</label>
                        <input defaultValue="0x3b5793536578224Dd7160aa23ABe829eaddb2225" id="address" className="form-control" {...register("addresss")}/>

                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="amount">Amount</label>
                        <input defaultValue="0.0012" id="amount" className="form-control" {...register("amount")}/>

                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Send</button>
                </form>
                {ok && <div className="alert alert-info mt-3">{ok}</div>}
                {ko && <div className="alert alert-danger mt-3">{ko}</div>}
            </div>
        );
    }

