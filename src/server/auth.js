import sha1 from 'sha1'

const usersCredentials = {}
const sessions = {}

export function registerUser(username, password) {
    if(username in usersCredentials) {
        return false
    } else {
        usersCredentials[username] = sha1(password)
        return true
    }
}

export function authenticateUser(username, password) {
    if(username in usersCredentials) {
        return sha1(password) == usersCredentials[username]    
    } else {
        return false
    }
}

export function authenticateSession(session) {
    if(session in sessions) {
        return true    
    } else {
        return false
    }
}
