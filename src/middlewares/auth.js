import { NextFunction, Request, Response } from "express";
import { Token } from "../utils/auth_token";



export const auth = (req, res, next) => {
  var userID = new Token().getUserIdFromToken(req.headers["x-auth-token"]);
  if (userID) {
    req.userID = userID;
    next();
  } else {

    
    res.status(401).json({ message: "Invalid Token" });
  }
};