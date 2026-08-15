export const getClosestCreatedAtDate = (data) => {
    const now = new Date();
    const closest = data?.reduce((closest, current) => {
        const closestDiff = Math.abs(new Date(closest?.createdAt) - now);
        const currentDiff = Math.abs(new Date(current?.createdAt) - now);
        return currentDiff < closestDiff ? current : closest;
    });
    return new Date(closest.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
};