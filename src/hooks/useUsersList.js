import { useEffect, useState } from "react";
import { getAllUsers } from "../utils/api";

export function useUsersList(refresh) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getAllUsers();
                if (!cancelled) setUsers(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refresh]);

    return { users, loading, error };
}