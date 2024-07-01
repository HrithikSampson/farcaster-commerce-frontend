"use client"

import { usePrivy,useLogout } from "@privy-io/react-auth";
import { useMemo } from "react";


export default function Home() {
  const {ready, authenticated,login,user} = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  // const disableLogin = !ready || (ready && authenticated);
  const logout = useLogout();
  const farcasterAccounts = useMemo(()=>{
    if(!user){
      return [];
    }
    return user!.linkedAccounts.filter((account) => account.type === 'farcaster')}
    ,[authenticated,ready,user]
  );
  const handleAuthClick = async () => {
    if (authenticated) {
      await logout.logout();
      console.log("Logout");
    } else {
      console.log("Login")
      login();
    }
  };
  return (
    <main>
      <span className="w-screen flex justify-end items-end">
        <button onClick={handleAuthClick} className={`relative m-2 p-2 focus:outline-none text-white ${!ready?"bg-gray-400 cursor-not-allowed":"bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300"} font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900`}>
          {(!authenticated)?"Login with Farcaster":"Logout"}</button>
      </span>
      <option>
      {farcasterAccounts.map((account)=>
      (<select key={account.signerPublicKey}>
        {account.signerPublicKey}
      </select>))}
      </option>
    </main>
  );
}
