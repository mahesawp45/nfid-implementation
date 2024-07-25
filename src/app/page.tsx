"use client";
import { SignIdentity } from "@dfinity/agent";
import { AuthClientStorage, IdleOptions } from "@dfinity/auth-client";
import { NFID } from "@nfid/embed";
import { useCallback, useState } from "react";

type NFIDConfig = {
  origin?: string; // default is "https://nfid.one"
  application?: {
    // your application details to display in the NFID iframe
    name?: string; // your app name user can recognize
    logo?: string; // your app logo user can recognize
  };
  identity?: SignIdentity;
  storage?: AuthClientStorage;
  keyType?: "ECDSA" | "Ed25519"; // default is "ECDSA"
  idleOptions?: IdleOptions;
};

export default function Home() {
  const [response, setResponse] = useState("");

  const nfid = NFID.init({
    application: {
      name: "MEDBLOCK",
      logo: "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg",
    },
  } as NFIDConfig);

  const handleAuthenticate = useCallback(async () => {
    if (!nfid) return alert("NFID is not initialized");

    try {
      const identity = await (
        await nfid
      )
        .getDelegation
        // targetCanisterIds.length ? { targets: targetCanisterIds } : undefined
        ();

      setResponse(identity.getPrincipal().toString());
    } catch (error: any) {
      setResponse(error.message);
    }
  }, [nfid, setResponse]);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <button
        className="p-4 bg-purple-600"
        onClick={() => {
          handleAuthenticate();
        }}
      >
        {!response ? "LOGIN NFID" : "LOGOUT"}
      </button>

      <div className="my-10">
        <p>Identity : {response}</p>
      </div>
    </main>
  );
}
