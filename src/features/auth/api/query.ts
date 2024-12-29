import { useQuery } from "@tanstack/react-query";
import type { GithubUser } from "../types";
import { getUser } from "@/services/auth-service";

/**
 * Type representing the result of the useUserQuery hook.
 */
export type UserQueryResult = ReturnType<typeof useUserQuery>;

/**
 * Custom hook to fetch the authenticated GitHub user.
 *
 * @returns {object} The result of the useQuery hook, which includes the user data, status, and other query information.
 */
export function useUserQuery() {
	return useQuery({
		queryKey: ["user"],
		queryFn: getUser,
		retry: false,
	});
}
