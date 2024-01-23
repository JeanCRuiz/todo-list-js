export const uniqueId = () => {
    const id = crypto.randomUUID();

    return id
}

export const formatDate = (dateSaved) => {
    try {
        const date = new Date(dateSaved)

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };

        return new Intl.DateTimeFormat('en-US', options).format(date)

    } catch (error) {
        throw new Error(`El formato de fecha suministrado no es el correcto`)
    }
}
