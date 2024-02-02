export default function newHistoryCache() {
    const users = {}

    return {
        get(phone) {
            const history = users[phone]
            if (!history) {
                users[phone] = []
                return []
            }
            return history
        },
        push(phone, role, message) {
            if (!users[phone]) {
                users[phone] = []
            }
			const history = users[phone]

            if (history.length === 25) {
                history.pop()
            }
			const obj = {role, content: message}
            history.push(obj)
        }
    }
}
