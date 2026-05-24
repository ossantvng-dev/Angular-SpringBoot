import { User } from "../../users/models/user";


export function getNextUserId(users: User[]): number {
    if (!users || users.length === 0) {
        return 1;
    }
    const maxId = Math.max(...users.map(u => u.id));
    return maxId + 1;
}