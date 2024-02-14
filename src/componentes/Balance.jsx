const {ethereum} = window
import { ethers} from "ethers"
import { useEffect,useState } from "react"

export function Balance(){
    const [cuenta, setCuenta] = useState(null)
    useEffect(()=>{
        ethereum && ethereum.request({method:'eth_requestAccounts'}).then(cuenta =>{
            setCuenta(cuenta[0])
            ethereum.on('accountsChanged', (i) =>{
                setCuenta(i[0])
            })
        })
    },[])
    useEffect(()=>{
        if(cuenta)    {
            const provider = new ethers.providers.Web3Provider(ethereum)
            provider.getBalance(cuenta).then(balance =>{
                console.log(ethers.utils.fromatEther(balance))
            })
        }
    },[cuenta])

    if (!ethereum){
        return <div>No hay metamask</div>
    }
    return(
        <h2>{
            cuenta ? cuenta: 'Cargando...'
            }
           </h2>
    )
}