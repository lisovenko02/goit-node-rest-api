import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import {User} from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { promises as fs } from 'fs';
import jimp from "jimp"

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

export const register = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user) {
            throw HttpError(409, "Email in use")
        };

        const hashPassword = await bcrypt.hash(password,10);
        const avatarURL = gravatar.url(email);

        const newUser = await User.create({...req.body, password: hashPassword, avatarURL})

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription
            }
        })
    } catch (error) {
        next(error)
    }
};

export const login = async(req,res,next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            throw HttpError(401, "Email or password is wrong");
        };
        
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        };

        const payload = {
            id: user._id
        };

        const token = jwt.sign(payload,SECRET_KEY, {expiresIn: "2h"})

        await User.findByIdAndUpdate(user._id, {token});

        res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription
            }
        })
    } catch (error) {
        next(error)
    }
};

export const logout = async(req,res,next) => {
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {token: ""});

        res.status(204).json()
    } catch (error) {
        next(error)
    }
};

export const getCurrent = async(req,res,next) => {
    try {
        const {email, subscription} = req.user;

        res.json({email, subscription})
    } catch (error) {
        next(error)
    }
}

export const updateSubscription = async(req,res,next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            throw HttpError(404)
        }

        const result = await User.findByIdAndUpdate(
           user._id, 
            req.body, {
                new:true
            })

        if(!result) {
            throw HttpError(404)
        }

        res.json({
            subscription: user.subscription, email
        })
    } catch (error) {
        next(error)
    }
};

export const updateAvatar = async(req,res,next) => {
    try {
        const {_id} = req.user;
        const {path:  tempUpload, originalname} = req.file;

        const changeSizeAvatar = await jimp.read(tempUpload);
        await changeSizeAvatar.resize(250, jimp.AUTO).writeAsync(tempUpload);

        const filename = `${_id}_${originalname}`;
        const resultToUpload = path.join(avatarsDir, filename)

        await fs.rename(tempUpload, resultToUpload);
            
        const avatarURL = path.join("avatars", filename);

        await User.findByIdAndUpdate(_id, {avatarURL});

        res.json({
            avatarURL
        })
    } catch (error) {
        next(error)
    }
}