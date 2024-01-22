export const uniqueId = () => {
    const id = crypto.randomUUID();

    return id
}

export const formatDate = (date) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

    return Intl.DateTimeFormat('en-us', options).format(new Date(date))
}