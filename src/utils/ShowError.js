export const showError = (errors, name) => {
    const exist = errors.find((error) => error.param === name);
        if(exist) {
            return exist.msg;
        } else {
            return null;
        }
}