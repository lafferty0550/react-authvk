export default class {
    static async getFriends(count, callback) {
        return window.VK.Api.call('friends.get', {fields: 'username', count, v: '5.112'}, callback);
    }
    static async login(callback) {
        return window.VK.Auth.login(callback);
    }
    static async logout() {
        window.VK.Auth.logout();
    }
}