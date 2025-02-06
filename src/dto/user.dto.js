class UserDTO {
    constructor(user, includePassword = false) {
        this._id = user._id;
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart = user.cart || null;

        if (includePassword) {
            this.password = user.password || null;
        }
    }
}

export default UserDTO;
