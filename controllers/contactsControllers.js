import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js"


export const getAllContacts = async(req, res, next) => {
        try {
                const {_id: owner} = req.user;

                const {page = 1, limit = 10, favorite=false} = req.query;
                const skip = (page - 1) * limit;

                const result = await Contact.find({owner, favorite}, "-__v", {skip, limit}).populate("owner", "email subscription");

                res.json(result);
            }
        catch(error) {
                next(error)
            }   
    };

export const getOneContact = async(req, res, next) => {
        try {
            const {id} = req.params;
            const result = await Contact.findById(id);
            if(!result) {
                throw HttpError(404, "Not found");
            }
            res.json(result);
        }
        catch(error) {
          next(error)
        }
    };

export const deleteContact = async(req, res, next) => {
        try {
            const {id} = req.params;
            const result = await Contact.findByIdAndDelete(id);
            if(!result) {
                throw HttpError(404);
            }
            res.json(result);
        }
        catch(error) {
        next(error)
        }
    };

export const createContact = async(req, res, next) => {
    try {
        const {_id: owner} = req.user;

        const result = await Contact.create({...req.body, owner});
        res.status(201).json(result);
    }
    catch(error) {
        next(error);
    }
};

export const updateContact = async(req, res, next) => {
    try {
        const isBodyEmpty = Object.keys(req.body).length === 0;
        if(isBodyEmpty) {
            throw HttpError(400, "Body must have at least one field");
        }
        const {id} = req.params;
        const result = await Contact.findByIdAndUpdate(
            id, 
            req.body,
            {new: true});
        if(!result){
            throw HttpError(404)
        }
        res.json(result);
    }
    catch(error) {
        next(error);
    }
};
export const updateStatusContact = async(req, res, next) => {
    try {
        const {id} = req.params;
        const result = await Contact.findByIdAndUpdate(
            id, 
            req.body, {
            new:true
        })

        if(!result) {
            throw HttpError(404)
        }

        res.json(result)
    } catch (error) {
        next(error)
    }
}
