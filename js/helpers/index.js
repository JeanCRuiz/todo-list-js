export const uniqueId = () => {
    const id = crypto.randomUUID();

    return id
}

export const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('en-US', options)
}