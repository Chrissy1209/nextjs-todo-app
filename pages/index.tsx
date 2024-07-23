import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import Edit from "./todo/edit";
import List from "./todo/list";

const Home: NextPage = () => {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);

  const handleLogIn = useCallback(() => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <>
      {!user ? (
        <button onClick={handleLogIn}>Signup with Google.</button>
      ) : (
        <div>
          <h1>To Do List</h1>
          <Edit userId={user.uid} />
          <List user={user} />
        </div>
      )}
    </>
  );
};

export default Home;
