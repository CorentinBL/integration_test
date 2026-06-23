import { useState } from "react";
import { deleteUser, getUserDetails } from "../utils/api";

export function useUsersAdminActions() {
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    const handleDelete = async (userId, token) => {
        setActionLoading(true);
        setActionError(null);

        try {
            await deleteUser(userId, token);
        } catch (err) {
            setActionError(err.message);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    const handleGetDetails = async (userId, token) => {
        setActionLoading(true);
        setActionError(null);

        try {
            const data = await getUserDetails(userId, token);
            return data;
        } catch (err) {
            setActionError(err.message);
            throw err;
        } finally {
            setActionLoading(false);
        }
    };

    return {
        handleDelete,
        handleGetDetails,
        actionLoading,
        actionError,
    };
}