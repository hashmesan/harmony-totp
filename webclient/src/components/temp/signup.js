import { useCallback } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React from "react";

export const SignUp = () => {
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    } catch (e) {
      alert(e.message);
    }
  }, []);

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="email" type="email" />
        <input name="password" placeholder="password" type="password" />
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};
