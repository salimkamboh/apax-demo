export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export const authTokenStorageKey = "apax.authToken";
export const authUserStorageKey = "apax.authUser";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const login = async (email: string, password: string) => {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as Partial<LoginResponse> & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.message ?? "Unable to sign in. Please try again.");
  }

  return data as LoginResponse;
};

export const saveAuthSession = ({ token, user }: LoginResponse) => {
  localStorage.setItem(authTokenStorageKey, token);
  localStorage.setItem(authUserStorageKey, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(authTokenStorageKey);
  localStorage.removeItem(authUserStorageKey);
};
