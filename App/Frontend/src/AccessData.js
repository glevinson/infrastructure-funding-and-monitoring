import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import axios from "axios";

export default function AccessData() {
  const [error, setError] = useState();
  const [data, setData] = useState([]);

  // Passes backend user's signature of message and requests data. 
  // Then updates 'data'/'error' accordingly: 
  // **************************************************************************
  const getData = (sig) => {
    const options = { 
      method: 'GET',
      url: 'http://localhost:8000/accessData',
      params: { signature: sig },
    }

    axios.request(options).then((response) => {
      setData(response.data)
    }).catch((error) => {
      console.error(error)
    })
  }

  /* Prompts user to sign 'message' using a crypto wallet, calls getData & 
     displays data corresponding to the account address */
  // **************************************************************************
  const handleSignature = async (e) => {
    e.preventDefault();
    setError();
    const message = "I would like to see my Spring DAO data"

    try {
      // Checking user has a crpto wallet:
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      // Retrieving signature:
      await window.ethereum.send("eth_requestAccounts");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      getData(signature)

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="m-4" onSubmit={handleSignature}>
      <div style={{width: '100vw', height: '100vh'}} className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-5xl font-semibold text-gray-700 text-center">
            Spring DAO Data Access
          </h1>
        </main>
        <div className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            View My Project Data!
          </button>
          <ErrorMessage message={error} />
        </div>
        {data.map((project) => {
          if (project == null){
            return (    
              <div className="p-" >
                <footer className="text-2xl font-semibold text-gray-700 text-center">
                  <p>No Data For This Address / Invalid Signature</p>
                </footer> 
              </div>       
            ); 
          }
          else if( project.url == null ){
            return(
              <div className="p-2" >
              <div className="text-2xl font-semibold text-gray-700">
                <p>{project.name}</p>
              </div>
              <div className="p-2" > 
                <div className="text-l font-semibold text-gray-700">
                 <i>Do not have enough tokens to view this projects data</i>
                </div> 
                </div>
            </div> 
            );
          }
          else{
          return (
            <div className="p-2" key = {project.name}>
              <div className="text-2xl font-semibold text-gray-700">
                <p>{project.name}</p>
                <img
                  src={project.url}
                  alt={project.url}
                />
              </div>
            </div>
          );}
        })}
      </div>
    </form>
  ); 
}

// References:

  // "handleSignature" was adapted from code demonstrated in: https://www.youtube.com/watch?v=vhUjCLYlnMM
  // "getData" was adapted from code demonstrated in: https://www.youtube.com/watch?v=YLq6JOsTok8
