class User {
    constructor(username, password) {
        this.id = "",
        this.firstName = "",
        this.lastName = "",
        this.age = "",
        this.alias = "",
        this.avatar = "",
        this.username = username.toString(),
        this.password = password.toString()
    }
}

export default User;
