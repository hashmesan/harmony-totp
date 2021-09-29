import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

import BasicHeader from "./basicHeader";
import AuthenticatedHeader from "./authenticatedHeader";

const Header = () => {
  const auth = getAuth();
  const [user, setUser] = useState(() => {
    const user = auth.currentUser;

    return user;
  });

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
  }, []);

  return <div>{!user ? <BasicHeader /> : <AuthenticatedHeader />}</div>;
};

export default Header;
