import { useEffect, useState } from "react";
import { ethers } from "ethers"; // Se añade la importación de ethers aquí
import { useFormAction } from "react-router-dom";
import{useForm} from 'react-hook-form'
const {ethereum} = window



export function Balance() {
    const [cuenta, setCuenta] = useState(null);
    const [balance, setBalance] = useState(null);
    const {register, handleSubmit} = useForm();

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
            //const provider = new ethers.providers.Web3Provider(window.ethereum);
            const provider = new ethers.BrowserProvider(window.ethereum)
            provider.getBalance(cuenta).then(bal => {
                console.log(ethers.utils.formatEther(bal));
                setBalance(ethers.utils.formatEther(bal));
            }).catch(err => console.error(err));
        }
    }, [cuenta]);

    function submit(data){
        console.log(data)
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
                    <input id="address" className="form-control" {...register("addresss")}/>

                </div>
                <div className="form-group mb-3">
                    <label htmlFor="amount">Amount</label>
                    <input id="amount" className="form-control" {...register("addresss")}/>

                </div>
                <button type="submit" className="btn btn-primary mb-3">Send</button>
            </form>
        </div>
    );
}
