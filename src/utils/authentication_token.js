const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

class Jwt {
    //generate token
    static async generateToken(id) {       
        return jwt.sign({"id":id},'privet-key');
    }
    static async verifyToken(token) { 
        try {           
            return jwt.verify(token,'privet-key');
        } catch (error) {
            //if token verification failed 
            return null;
        }      
    }
}

module.exports = Jwt;