export const isRequired = (value) => !value ? "Field is required" : ""

export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !regex.test(email) ? "Invalid Mail" : "";
};

export const isValidName = (name) => {
    const regex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    return !regex.test(name) ? "Invalid Name" : "";
};

export const isAdult = (date) => {
    const today = new Date();
    const birth = new Date(date);

    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    const isUnder18 = age < 18 || (age === 18 && m < 0);

    return isUnder18 ? "You should be over eighteen" : "";
};

export const isValidPostalCode = (code) => {
    const regex = /^[0-9]{5}$/;
    return !regex.test(code) ? "Invalid Postal Code" : "";
};