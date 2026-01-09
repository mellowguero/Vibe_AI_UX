import { AuthContext } from "./context/AuthContext.ts";
import React, { useState } from 'react';
export default function Root({ children }) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1e5aa359-db93-455b-8285-ac7b5edaefa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Main.js:4',message:'Root component initialized',data:{initialUser:null,userType:'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{ user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}