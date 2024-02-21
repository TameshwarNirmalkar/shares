const authenticate = async (credentials: { email: string; password: string }): Promise<any> => {
  try {
    const res = await fetch(`/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then((res) => res.json());
    return res;
  } catch (error: any) {
    return new Error(error);
  }
};

export const userService = {
  authenticate,
};
