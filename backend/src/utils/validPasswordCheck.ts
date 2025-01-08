export const validPasswordCheck = async (password: string): Promise<boolean> => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    const valid = regex.test(password);

    return valid;
}