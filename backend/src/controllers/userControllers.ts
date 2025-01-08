import {Request , Response} from 'express';
import {Guest, Admin} from '@/models/userModel';
import { emailValidation } from '@/utils/emailValidation';
import { checkRequiredFields } from '@/utils/checkRequiredFields';
import { nameFormatter } from '@/utils/nameFormatter';
import { validPasswordCheck } from '@/utils/validPasswordCheck';
import bcrypt from 'bcrypt';

export const guestUserRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const email: string = req.body.email;

        if(!email) {
            res.status(400).json({
                 message: "Email is undefined."});
            
            return;
        }

        const validEmail: boolean = await emailValidation(email);

        if(!validEmail){
            res.status(400).json({
                message: "Invalid email format. Email has to be in the format of test@gmail.com"
            });

            return;
        }

        const existingGuest = await Guest.findOne({email});

        if(existingGuest){
            res.status(400).json({
                message: "Email already registered."
            });

            return;
        }

        const data = new Guest({
            email: email
        })

        const newGuest = await data.save();

        res.status(201).json({ message: "New guest user registered successfully."})

      } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
        console.log(error);
      }
};

export const adminUserRegister = async (req: Request , res: Response): Promise<void> => {
    try{
        const requiredFields = ["firstName", "lastName", "email" , "password" , "passwordConfirm"];
        const missingFields = await checkRequiredFields(req.body , requiredFields)

        if(missingFields.length){
            res.status(400).json({
                message: `Request body fields missing: ${missingFields.join(", ")}`
            });

            return;
        };

        const userName: string = await nameFormatter(req.body.firstName , req.body.lastName);

        const name: string = userName;
        const email: string = req.body.email;
        const password: string = req.body.password;
        const passwordConfirm: string = req.body.passwordConfirm;
    
        const validEmail = emailValidation(email);
    
        if(!validEmail){
            res.status(400).json({
                message: "Invalid email format. Email has to be in the format of test@gmail.com"
            });
    
            return;
        };

        const existingAdmin = await Admin.findOne({email});

        if(existingAdmin){
            res.status(400).json({
                message: "Email already registered."
            });

            return;
        }

        const validPassword = await validPasswordCheck(password);

        if(!validPassword){
            res.status(400).json({
                message: "Password must be at least 8 characters, contain one upper case letter, one lower case letter and one special character."
            });

            return;
        };

        if(password != passwordConfirm){
            res.status(400).json({
                message: "Password and password confirmation are not the same."
            })
    
            return;
        }
    
        const passwordEncryption = await bcrypt.hash(password , 10);
    
        const data = new Admin ({
            name: name,
            email: email,
            passwordHash: passwordEncryption,
            role: 'admin'
        })
    
        const newAdmin = await data.save();
    
        res.status(201).json({ message: "New Admin registered successfully."})
   
    }catch(error){
        res.status(500).json({ message: "An error occurred", error });
        console.log(error);
    }


}