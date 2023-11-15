"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";

type UserState = {
  loading: boolean;
  data: UserType[];
};

type UserType = {
  id: string;
  email: string;
  name: string;
};

const Users = () => {
  const [users, setUsers] = useState<UserState>({
    loading: true,
    data: [],
  });
  const auth = useAppSelector((state) => state.auth.sessionToken);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getUsers = async () => {
      const result = await fetch("/api/users", {
        credentials: "include",
        method: "GET",
      });
      const data = (await result.json()) as UserType[];
      console.log(data);
      setUsers({
        loading: false,
        data,
      });
    };
    getUsers();
  }, []);
  return (
    <div>
      {users.loading ? (
        "loading"
      ) : (
        <div>
          {users.data.map((user) => (
            <span key={user.id}>{user.name}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
