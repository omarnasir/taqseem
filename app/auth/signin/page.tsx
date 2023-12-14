"use client"

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { getCsrfToken } from "next-auth/react";

export default function SignIn() {
  const [data, setData] = useState({
    username: "", password: "",
    email: ""
  });

  const csrfToken = getCsrfToken()

  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Username
        <input name="username" type="text" 
        value={data?.username}
        onChange={(e) => setData({ ...data, username: e.target.value })}
        />
      </label>
      <label>
        Email
        <input name="email" type="text" 
        value={data?.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </label>
      <label>
        Password
        <input name="password" type="password"
        value={data?.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </label>
      <button onClick={() => signIn("credentials", 
      { username: data?.username, password: data?.password, email: data?.email })
      }>Sign In</button>
    </form>
  )
}
